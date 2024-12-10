const axios = require('axios');

// Mise à jour de l'URL pour correspondre au port par défaut
const API_URL = 'http://localhost:3001/books';

async function testAPI() {
    try {
        // 1. Test création d'un livre
        console.log('\n1. Création d\'un livre...');
        const newBook = await axios.post(API_URL, {
            title: "Test Book",
            author: "Test Author",
            categories: ["Test"],
            publishedDate: new Date(),
            description: "Test description"
        });
        console.log('Livre créé:', newBook.data);
        const bookId = newBook.data._id;

        // 2. Test liste des livres
        console.log('\n2. Récupération de la liste des livres...');
        const bookList = await axios.get(API_URL);
        console.log('Nombre de livres:', bookList.data.books.length);

        // 3. Test mise à jour du livre
        console.log('\n3. Mise à jour du livre...');
        const updatedBook = await axios.put(`${API_URL}/${bookId}`, {
            title: "Test Book Updated",
            author: "Test Author Updated",
            categories: ["Test Updated"],
            description: "Test description updated"
        });
        console.log('Livre mis à jour:', updatedBook.data);

        // 4. Test événement test
        console.log('\n4. Test de l\'événement...');
        const testEvent = await axios.post(`${API_URL}/test-event`);
        console.log('Résultat du test événement:', testEvent.data);

        // 5. Test suppression du livre
        console.log('\n5. Suppression du livre...');
        const deleteResult = await axios.delete(`${API_URL}/${bookId}`);
        console.log('Résultat de la suppression:', deleteResult.data);

        console.log('\nTous les tests ont réussi!');
    } catch (error) {
        console.error('Erreur pendant les tests:', error.response?.data || error.message);
    }
}

// Exécuter les tests
testAPI();