const http = require('http');

// Configuration des tests
const BASE_URL = 'http://localhost:8000';
const TEST_USER_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // À remplacer par un vrai token

console.log('🚀 Tests du système de notifications en cours...\n');

// Helper pour les requêtes HTTP
function makeRequest(options, data = null) {
	return new Promise((resolve, reject) => {
		const req = http.request(options, (res) => {
			let responseData = '';
			res.on('data', (chunk) => {
				responseData += chunk;
			});
			res.on('end', () => {
				try {
					const parsed = JSON.parse(responseData);
					resolve({
						status: res.statusCode,
						data: parsed,
					});
				} catch (e) {
					resolve({
						status: res.statusCode,
						data: responseData,
					});
				}
			});
		});

		req.on('error', reject);

		if (data) {
			req.write(JSON.stringify(data));
		}
		req.end();
	});
}

// Test 1: Créer un thread (devrait déclencher une notification)
async function testCreateThread() {
	console.log("📝 Test 1: Création d'un thread...");

	try {
		const options = {
			hostname: 'localhost',
			port: 8000,
			path: '/api/thread',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const data = {
			participants: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
		};

		const result = await makeRequest(options, data);
		console.log(`   Status: ${result.status}`);
		console.log(`   Réponse:`, result.data);

		if (result.status === 201) {
			console.log('   ✅ Thread créé avec succès\n');
			return result.data._id;
		} else {
			console.log('   ❌ Échec de création du thread\n');
			return null;
		}
	} catch (error) {
		console.log('   ❌ Erreur:', error.message, '\n');
		return null;
	}
}

// Test 2: Envoyer un message (devrait déclencher une notification)
async function testSendMessage(threadId) {
	console.log("📝 Test 2: Envoi d'un message...");

	try {
		const options = {
			hostname: 'localhost',
			port: 8000,
			path: '/api/message',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const data = {
			threadId: threadId || '507f1f77bcf86cd799439011',
			from: '507f1f77bcf86cd799439011',
			to: ['507f1f77bcf86cd799439012'],
			text: 'Message de test pour déclencher une notification!',
		};

		const result = await makeRequest(options, data);
		console.log(`   Status: ${result.status}`);
		console.log(`   Réponse:`, result.data);

		if (result.status === 201) {
			console.log('   ✅ Message envoyé avec succès\n');
		} else {
			console.log("   ❌ Échec d'envoi du message\n");
		}
	} catch (error) {
		console.log('   ❌ Erreur:', error.message, '\n');
	}
}

// Test 3: Récupérer les notifications (nécessite un token)
async function testGetNotifications() {
	console.log('📝 Test 3: Récupération des notifications...');

	if (!TEST_USER_TOKEN || TEST_USER_TOKEN === 'YOUR_JWT_TOKEN_HERE') {
		console.log('   ⚠️  Token manquant - test ignoré\n');
		return;
	}

	try {
		const options = {
			hostname: 'localhost',
			port: 8000,
			path: '/api/notifications',
			method: 'GET',
			headers: {
				Authorization: `Bearer ${TEST_USER_TOKEN}`,
				'Content-Type': 'application/json',
			},
		};

		const result = await makeRequest(options);
		console.log(`   Status: ${result.status}`);
		console.log(`   Notifications:`, result.data);

		if (result.status === 200) {
			console.log('   ✅ Notifications récupérées avec succès\n');
		} else {
			console.log('   ❌ Échec de récupération des notifications\n');
		}
	} catch (error) {
		console.log('   ❌ Erreur:', error.message, '\n');
	}
}

// Test 4: Compter les notifications non lues
async function testUnreadCount() {
	console.log('📝 Test 4: Comptage des notifications non lues...');

	if (!TEST_USER_TOKEN || TEST_USER_TOKEN === 'YOUR_JWT_TOKEN_HERE') {
		console.log('   ⚠️  Token manquant - test ignoré\n');
		return;
	}

	try {
		const options = {
			hostname: 'localhost',
			port: 8000,
			path: '/api/notifications/unread-count',
			method: 'GET',
			headers: {
				Authorization: `Bearer ${TEST_USER_TOKEN}`,
				'Content-Type': 'application/json',
			},
		};

		const result = await makeRequest(options);
		console.log(`   Status: ${result.status}`);
		console.log(`   Compteur:`, result.data);

		if (result.status === 200) {
			console.log('   ✅ Compteur récupéré avec succès\n');
		} else {
			console.log('   ❌ Échec de récupération du compteur\n');
		}
	} catch (error) {
		console.log('   ❌ Erreur:', error.message, '\n');
	}
}

// Exécuter tous les tests
async function runAllTests() {
	try {
		const threadId = await testCreateThread();
		await testSendMessage(threadId);
		await testGetNotifications();
		await testUnreadCount();

		console.log('🎉 Tests terminés !');
		console.log('\n📋 Pour tester les notifications WebSocket:');
		console.log('1. Connectez-vous au serveur Socket.IO sur http://localhost:8000');
		console.log('2. Émettez des événements comme "message:send", "lead:create"');
		console.log('3. Écoutez les événements "notification:new"');
		console.log(
			"\n💡 N'oubliez pas de remplacer TEST_USER_TOKEN par un vrai token JWT pour tester les routes authentifiées!"
		);
	} catch (error) {
		console.error('❌ Erreur globale:', error);
	}
}

// Vérifier que le serveur est démarré
setTimeout(runAllTests, 1000);
