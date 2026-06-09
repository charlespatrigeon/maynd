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

function sendMessage() {
    const input = document.getElementById('user-input');
    const text = input.value.trim();
    if (!text) return;

    // Vérification de la limite gratuite
    if (messageCount >= maxFreeMessages) {
        document.getElementById('paywall').classList.remove('hidden');
        return;
    }

    // Afficher le message de l'utilisateur
    appendMessage(text, 'user');
    input.value = '';
    messageCount++;

    // Simuler une réponse du Coach (En production, tu appelleras ici l'API OpenAI)
    setTimeout(() => {
        let reply = "";
        if (currentCoach === 'sport') {
            reply = `C'est une excellente réflexion. En sport, le mental fait 80% du résultat. Pour ton point sur "${text}", as-tu déjà essayé la visualisation positive ?`;
        } else {
            reply = `Je comprends tout à fait. Dans le cadre professionnel, ce que tu décris ("${text}") ressemble à un besoin de fixer des limites claires. Qu'en penses-tu ?`;
        }
        appendMessage(reply, 'bot');
    }, 1000);
}

function appendMessage(text, sender) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll automatique vers le bas
}