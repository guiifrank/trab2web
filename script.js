const form = document.getElementById("form-contato")
const nomeInput = document.getElementById("nome")
const emailInput = document.getElementById("email")
const telefoneInput = document.getElementById("telefone")
const listaContatos = document.getElementById("lista-contatos")
const buscaInput = document.getElementById("busca")
const btnSalvar = document.getElementById("btn-salvar")

let contatos = []
let idEmEdicao = null

window.addEventListener("load", () => {
  const dadosSalvos = localStorage.getItem("contatos")
  if (dadosSalvos) contatos = JSON.parse(dadosSalvos)
  renderizarContatos(contatos)
})

function salvarNoLocalStorage() {
  localStorage.setItem("contatos", JSON.stringify(contatos))
}

form.addEventListener("submit", (e) => {
  e.preventDefault()

  const nome = nomeInput.value.trim()
  const email = emailInput.value.trim()
  const telefone = telefoneInput.value.trim()

  if (!nome || !email || !telefone) return

  if (idEmEdicao === null) {
    const novoContato = {
      id: Date.now(),
      nome,
      email,
      telefone,
    }
    contatos.push(novoContato)
  } else {
    const index = contatos.findIndex((c) => c.id === idEmEdicao)
    contatos[index] = { id: idEmEdicao, nome, email, telefone }
    idEmEdicao = null
    btnSalvar.textContent = "Adicionar Contato"
  }

  salvarNoLocalStorage()
  renderizarContatos(contatos)
  form.reset()
})

function renderizarContatos(lista) {
  listaContatos.innerHTML = ""

  lista.forEach((contato) => {
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${contato.nome}</td>
      <td>${contato.email}</td>
      <td>${contato.telefone}</td>
      <td>
        <button class="btn-editar" onclick="editarContato(${contato.id})">Editar</button>
        <button class="btn-remover" onclick="removerContato(${contato.id})">Remover</button>
      </td>
    `

    listaContatos.appendChild(tr)
  })
}

function removerContato(id) {
  contatos = contatos.filter((c) => c.id !== id)
  salvarNoLocalStorage()
  renderizarContatos(contatos)
}

function editarContato(id) {
  const contato = contatos.find((c) => c.id === id)
  if (!contato) return

  nomeInput.value = contato.nome
  emailInput.value = contato.email
  telefoneInput.value = contato.telefone

  idEmEdicao = id
  btnSalvar.textContent = "Salvar Alterações"
}

buscaInput.addEventListener("input", () => {
  const termo = buscaInput.value.toLowerCase()
  const filtrados = contatos.filter(
    (c) =>
      c.nome.toLowerCase().includes(termo) ||
      c.email.toLowerCase().includes(termo)
  )
  renderizarContatos(filtrados)
})
