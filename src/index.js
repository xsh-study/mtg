import * as d3 from "d3";
import { MtgService } from "./mtgService";
import { ManaCost } from "./widgets/manaCost";
import { ManaColor } from "./widgets/manaColor";

document.addEventListener("DOMContentLoaded", setup);

const deck = [];
let allCards = [];

function setup() {
    const mtg = new MtgService();
    mtg.loadCards().then(cards => {
        allCards = cards;
        populateCardList(allCards);
    });
}

function populateCardList(cards) {
    const cardListContainer = document.getElementById("cardListContainer");
    cardListContainer.innerHTML = "";

    const availableCards = cards.filter(card => !deck.includes(card));

    const list = document.createElement("ul");
    availableCards.forEach(card => {
        const listItem = document.createElement("li");
        listItem.innerHTML = card.name;
        listItem.addEventListener("click", () => {
            showCardDetails(card);
        });
        list.appendChild(listItem);
    });
    cardListContainer.appendChild(list);
}

function showCardDetails(card) {
    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = `
        <button id="addCardButton" style="margin-bottom: 10px;">Add to deck</button>
        <h3>${card.name}</h3>
        <p>type: ${card.type}</p>
        <p>manaCost: ${card.manaCost}</p>
        <p>${card.text}</p>
        ${card.imageUrl ? `<img src="${card.imageUrl}" alt="${card.name}"/>` : ""}
    `;

    document.getElementById("addCardButton").onclick = () => addToDeck(card);
}


function addToDeck(card) {
    if (deck.some(existingCard => existingCard.id === card.id)) {
        alert("This card is already in the deck!");
        return;
    }

    deck.push(card);
    updateDeckView();
    updateWidgets();

    populateCardList(allCards);
}


function updateDeckView() {
    const deckContainer = document.querySelector(".deckContainer");
    deckContainer.innerHTML = "<p class='sectionLeadingLabel'>Deck</p>";
    deck.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.innerHTML = `
            <span>${card.name}</span>
            <button onclick="removeFromDeck(${index})">Delete</button>
        `;
        deckContainer.appendChild(cardElement);
    });
}

function removeFromDeck(index) {
    const removedCard = deck.splice(index, 1)[0];
    updateDeckView();
    updateWidgets();

    populateCardList(allCards);
}

function updateWidgets() {
    const manaCostData = calculateManaCostData();
    const manaColorData = calculateManaColorData();

    const manaCostContainer = document.getElementById("manaCostWidgetContainer");
    manaCostContainer.innerHTML = "";
    const manaCost = new ManaCost();
    manaCost.build(manaCostData, manaCostContainer);

    const manaColorContainer = document.getElementById("manaColorWidgetContainer");
    manaColorContainer.innerHTML = "";
    const manaColor = new ManaColor();
    manaColor.build(manaColorData, manaColorContainer);
}

function calculateManaCostData() {
    const costMap = {};
    deck.forEach(card => {
        const cost = card.manaCost || "non";
        costMap[cost] = (costMap[cost] || 0) + 1;
    });
    return Object.entries(costMap).map(([cost, count]) => ({ cost, count }));
}

function calculateManaColorData() {
    const colorMap = {};
    deck.forEach(card => {
        const color = card.color || "Colorless";
        colorMap[color] = (colorMap[color] || 0) + 1;
    });
    return Object.entries(colorMap).map(([color, count]) => ({ color, count }));
}

window.removeFromDeck = removeFromDeck;
