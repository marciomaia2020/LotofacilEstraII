document.getElementById('gerarJogos').addEventListener('click', gerarJogos);
document.getElementById('exportarExcel').addEventListener('click', exportarParaExcel);
document.getElementById('exportarTxt').addEventListener('click', exportarParaTXT);

let jogos = []; // Para armazenar os jogos gerados

function gerarJogos() {
    const dezenasInput = document.getElementById('dezenas').value.split(',').map(Number).filter(Boolean);
    const excluirInput = Number(document.getElementById('excluir').value);
    const erroDezenas = document.getElementById('mensagemErro');
    jogos = []; // Resetar os jogos

    erroDezenas.textContent = '';

    // Validação das 12 dezenas
    if (dezenasInput.length !== 12) {
        erroDezenas.textContent = "Você deve escolher exatamente 12 dezenas.";
        return;
    }

    // Validação de exclusão
    if (isNaN(excluirInput) || dezenasInput.includes(excluirInput)) {
        erroDezenas.textContent = "Exclua apenas uma dezena válida que não esteja entre as escolhidas.";
        return;
    }

    // Obter as dezenas restantes (de 1 a 25, excluindo as 12 escolhidas)
    const todasAsDezenas = Array.from({ length: 25 }, (_, i) => i + 1);
    const dezenasRestantes = todasAsDezenas.filter(num => !dezenasInput.includes(num));

    // Gerar 4 jogos com as mesmas 12 dezenas e 3 dezenas adicionais de dezenasRestantes
    for (let i = 0; i < 10; i++) {
        const jogo = [...dezenasInput]; // As 12 dezenas fixas
        const tresDezenasExtras = dezenasRestantes.slice(i * 3, i * 3 + 3); // Seleciona 3 dezenas para completar
        jogo.push(...tresDezenasExtras);
        jogo.sort((a, b) => a - b); // Ordenar as dezenas
        jogos.push(jogo);
    }

    mostrarJogos(jogos);
    document.getElementById('exportarExcel').disabled = false;
    document.getElementById('exportarTxt').disabled = false;
}

function mostrarJogos(jogos) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';

    jogos.forEach((jogo, index) => {
        const jogoDiv = document.createElement('div');
        jogoDiv.className = 'jogo';
        
        const jogoLabel = document.createElement('div');
        jogoLabel.className = 'jogo-label';
        jogoLabel.textContent = `Jogo ${index + 1}:`;
        jogoDiv.appendChild(jogoLabel);
        
        jogoDiv.innerHTML += jogo.join(', ');
        resultadosDiv.appendChild(jogoDiv);
    });
}

function exportarParaExcel() {
    const wb = XLSX.utils.book_new();
    const header = ['Jogo', ...Array(15).fill(null).map((_, i) => `Número ${i + 1}`)];
    const data = jogos.map((jogo, index) => [`Jogo ${index + 1}`, ...jogo]);

    const sheetData = [header, ...data];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, 'Jogos');
    XLSX.writeFile(wb, 'jogos_lotofacil.xlsx');
}

function exportarParaTXT() {
    const texto = jogos.map(jogo => jogo.join(' ')).join('\n');
    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jogos_lotofacil.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
