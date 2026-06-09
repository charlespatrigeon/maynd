let currentCoach = 'sport';
let messageCount = 0;
const maxFreeMessages = 3; // Limite de la démo gratuite

const coachData = {
    sport: {
        title: "Discussion avec le Coach Sportif",
        welcome: "Bonjour ! Je suis votre coach mental sportif. Quel est votre objectif aujourd'hui ? Dépasser vos limites ou gérer le stress d'une compétition ?"
    },
    pro: {
        title: "Discussion avec le Coach Vie Professionnelle",
        welcome: "Bonjour. Je suis votre coach en évolution professionnelle. Rencontrez-vous un syndrome de l'imposteur, un besoin de reconversion ou une baisse de motivation ?"
    }
};

function selectCoach(coach) {
    currentCoach = coach;
    document.getElementById('btn-sport').classList.toggle('active', coach === 'sport');
    document.getElementById('btn-pro').classList.toggle('active', coach === 'pro');
    document.getElementById('chat-title').innerText = coachData[coach].title;
    
    // Réinitialiser le chat avec le message d'accueil du bon coach
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = `<div class="message bot">${coachData[coach].welcome}</div>`;
}

function checkEnter(event) {
    if (event.key === 'Enter') sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    // Vérification de la limite gratuite
    if (messageCount >= maxFreeMessages) {
        document.getElementById('paywall').classList.remove('hidden');
        return;
    }

    // 1. Afficher le message de l'utilisateur
    appendMessage(text, 'user');
    input.value = '';
    messageCount++;

    // 2. Afficher un indicateur de chargement
    appendMessage("Le coach réfléchit...", 'bot-loading');

    try {
        // 3. Appeler notre fonction Netlify
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ coach: currentCoach, message: text })
        });

        const data = await response.json();
        
        // Retirer l'indicateur de chargement et afficher la vraie réponse
        const loadingMsg = document.querySelector('.bot-loading');
        if (loadingMsg) loadingMsg.remove();
        
        appendMessage(data.reply, 'bot');

    } catch (error) {
        const loadingMsg = document.querySelector('.bot-loading');
        if (loadingMsg) loadingMsg.remove();
        
        appendMessage("Désolé, j'ai un petit problème technique. Réessaye !", 'bot');
        console.error(error);
    }
}

function appendMessage(text, sender) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll automatique vers le bas
}
