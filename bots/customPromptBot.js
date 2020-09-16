// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, CardFactory } = require('botbuilder');
const apiCall = require('./../localStorage.json')

// The accessor names for the conversation flow and user profile state property accessors.
const CONVERSATION_FLOW_PROPERTY = 'CONVERSATION_FLOW_PROPERTY';
const USER_PROFILE_PROPERTY = 'USER_PROFILE_PROPERTY';

// Identifies the last question asked.
const question = {
    name: 'name',
    fileName: 'fileName',
    date: 'date',
    none: 'none'
};

let findItens = []

let pathUrl = ''

// Defines a bot for filling a user profile.
class CustomPromptBot extends ActivityHandler {
    // /**
    //  *
    //  * @param {UserState} User state to persist boolean flag to indicate
    //  *                    if the bot had already welcomed the user
    //  */
    constructor(conversationState, userState) {
        super();
        // The state property accessors for conversation flow and user profile.
        this.conversationFlow = conversationState.createProperty(CONVERSATION_FLOW_PROPERTY);
        this.userProfile = userState.createProperty(USER_PROFILE_PROPERTY);

        // The state management objects for the conversation and user.
        this.conversationState = conversationState;
        this.userState = userState;


        this.onMessage(async (turnContext, next) => {
            const flow = await this.conversationFlow.get(
                turnContext, { lastQuestionAsked: question.none, init: false });
            const profile = await this.userProfile.get(turnContext, {});

            // await turnContext.sendActivity('Olá seja bem vindo ao meu chatbot. Vou te passar algumas informações inicias antes de começarmos, tudo bem?!');
            // await turnContext.sendActivity('Como esta é uma prévia de como funcionará o chatbot você apenas poderá responder as perguntas pré-selecionadas');
            // await turnContext.sendActivity('Em um versão posterior iremos usar Machine Learning para treinar o bot para responder as mais variadas perguntas. Usaremos um banco de dados na nuvem para um melhor tempo de processamento e armazenamento de documentos');

            await CustomPromptBot.fillOutUserProfile(flow, profile, turnContext);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    async run(context) {
        await super.run(context);

        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }

    // Manages the conversation flow for filling out the user's profile.
    static async fillOutUserProfile(flow, profile, turnContext) {
        const input = turnContext.activity.text;
        let result;
        switch (flow.lastQuestionAsked) {
        // If we're just starting off, we haven't asked the user for any information yet.
        // Ask the user for their name and update the conversation flag.
        case question.none:
            await turnContext.sendActivity("Vamos começar. Qual o seu nome?");
            flow.lastQuestionAsked = question.name;
            break;

        // If we last asked for their name, record their response, confirm that we got it.
        // Ask them for their age and update the conversation flag.
        case question.name:
            result = this.validateName(input);
            if (result.success) {
                profile.name = result.name;
                await turnContext.sendActivity(`Como vai ${ profile.name }, espero que esteja tudo bem =)`);
                await turnContext.sendActivity('Qual o tipo sanguineo que você deseja procurar?');
                flow.lastQuestionAsked = question.fileName;
                break;
            } else {
                // If we couldn't interpret their input, ask them for it again.
                // Don't update the conversation flag, so that we repeat this step.
                await turnContext.sendActivity(result.message || "Desculpe, não pude comprender o que você disse.");
                break;
            }

        // If we last asked for their age, record their response, confirm that we got it.
        // Ask them for their date preference and update the conversation flag.
        case question.fileName:
            result = this.findPersons(input);
            if (result.success) {
                profile.fileName = result.fileName;
                await turnContext.sendActivity(`Encontrei o arquivo que você solicitou.`);
                await turnContext.sendActivity(`Aqui esta o resultado: ${findItens}`);
                await turnContext.sendActivity(`Agora digite o nome desejado para vizualizar o pdf`);
                flow.lastQuestionAsked = question.date;
                break;
            } else {
                // If we couldn't interpret their input, ask them for it again.
                // Don't update the conversation flag, so that we repeat this step.
                await turnContext.sendActivity(result.message || "Desculpe não consequi entender o que você digitou.");
                break;
            }

        // If we last asked for a date, record their response, confirm that we got it,
        // let them know the process is complete, and update the conversation flag.
        case question.date:
            result = this.urlToPDF(input);
            if (result.success) {
                profile.date = result.date;
                await turnContext.sendActivity(`Neste link você encontrará mais informações sobre a pessoa que você pesquisou: ${pathUrl}`);
                await turnContext.sendActivity('Obrigada por utilizar este bot, chegamos ao fim');
                await turnContext.sendActivity('Digite qualquer coisa para começar novamente');
                flow.lastQuestionAsked = question.none;
                profile = {};
                break;
            } else {
                // If we couldn't interpret their input, ask them for it again.
                // Don't update the conversation flag, so that we repeat this step.
                await turnContext.sendActivity(result.message || "I'm sorry, I didn't understand that.");
                break;
            }
        }
    }

    static validateName(input) {
        const name = input && input.trim();
        return name !== undefined
            ? { success: true, name: name }
            : { success: false, message: 'Por favor, diga seu nome com pelo menos uma letra.' };
    };

    static urlToPDF(input) {
        try {
            let output;
            let found = apiCall.find(el => el.titleFile === input)
            output = { success: true, message: `Aqui esta o link para o arquivo ${found.localPath}` }
            pathUrl = found.localPath
            return output || { success: false, message: 'Não encontramos o arquivo digitado =/' }
        } catch (error) {
            return {
                success: false,
                message: "Digite exatamente o nome encontrado na lista acima"
            };
        }
    };

    static findPersons(input) {
        try {
            // caminho so storageLocal
            let output;
            const arrayDatas = apiCall
            const found = []
            for (let i = 0; i < arrayDatas.length; i++) {
                const arrayKeyWords = arrayDatas[i].keysWords
                let palavraAchada = arrayKeyWords.find(item => item === input)
                if (palavraAchada) {
                    found.push(arrayDatas[i])
                }
            }
            if (found) {
                output = { success: true, message: `encontramos resultados para o tipo sanguíneo ${input}` }
                findItens = found.map(el => {
                    return el.titleFile
                })
            }
            return output || { success: false, message: 'Não encontramos o arquivo digitado =/' }
        } catch (error) {
            return {
                success: false,
                message: "Digite um texto válido"
            };
        }
    }

}

module.exports.CustomPromptBot = CustomPromptBot;
