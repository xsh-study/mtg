class MtgService {
    constructor(baseUrl = "https://api.magicthegathering.io/v1") {
        this.baseUrl = baseUrl;
    }

    loadCards() {
        return fetch(this.baseUrl + "/cards")
            .then(response => response.json())
            .then(json => {
                return json.cards.map(card => ({
                    id: card.id,
                    name: card.name,
                    manaCost: card.manaCost,
                    color: this.getFullColorName(card.colors ? card.colors[0] : 'Colorless'),
                    imageUrl: card.imageUrl,
                    type: card.type,
                    text: card.text
                }));
            });
    }

    getFullColorName(colorCode) {
        const colorMap = {
            W: 'White',
            U: 'Blue',
            B: 'Black',
            R: 'Red',
            G: 'Green'
        };
        return colorMap[colorCode] || 'Colorless';
    }
}

export { MtgService };
