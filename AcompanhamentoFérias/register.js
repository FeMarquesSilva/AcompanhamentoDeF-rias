document.addEventListener('DOMContentLoaded', function () {
    const registerButton = document.getElementById('enter');
    registerButton.addEventListener('click', function () {
        window.location.href = 'login.html'; // Redireciona para a página de login
    });
});

document.getElementById('formCadastro').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    const confSenha = document.getElementById('Confpassword').value;

    const messageElement = document.getElementById('message');

    if (senha !== confSenha) {
        displayMessage('As senhas não coincidem. Por favor, tente novamente.', 'error');
        return;
    }

    const hashedSenha = await hashString(senha);

    try {
        const { data, error } = await supabaseClient
            .from('usuarios')
            .insert([
                {
                    name: nome,
                    email: email,
                    password: hashedSenha
                }
            ]);

        document.getElementById('formCadastro').reset();

        if (error) {
            console.error(error);
            displayMessage(`Erro ao salvar os dados do usuário: ${error.message}`, 'error');
        } else {
            displayMessage('Usuário salvo com sucesso!', 'success');
        }
    } catch (err) {
        console.error(err);
        displayMessage('Erro ao conectar com o Supabase.', 'error');
    }
});

async function hashString(message) {
    const msgBuffer = new TextEncoder().encode(message); // Codifica a string como (utf-8)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer); // Faz o hash da mensagem
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // Converte ArrayBuffer em Array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Converte bytes para hex string
    return hashHex;
}

function displayMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    messageElement.style.display = 'block';
}