let candidatos = [
  { id: "1", cpf: "42604610876", nome: "Lucas Vieira Dias", celular: "11957770782", email: "lvdias98@gmail.com", sexo: "Masculino", nascimento: "01/12/1998", skills: { html: true, css: true, js: true } },
  { id: "2", cpf: "42604610876", nome: "Nelson Santana", celular: "11957770782", email: "lvdias98@gmail.com", sexo: "Masculino", nascimento: "01/12/1998", skills: { html: true, css: true, js: true } },
];


function abrirModal(candidato) {
  if (candidato) {
    document.getElementById("id").value = candidato.id;
    document.getElementById("cpf").value = candidato.cpf;
    document.getElementById("nome").value = candidato.nome;
    document.getElementById("celular").value = candidato.celular;
    document.getElementById("email").value = candidato.email;
    if (candidato.sexo == 'Masculino') {
      document.getElementById("sexoMasculino").checked = true;
    } else {
      document.getElementById("sexoFeminino").checked = true;
    }
    document.getElementById("nascimento").value = candidato.nascimento.split('/').reverse().join('-');
    document.getElementById("skillHtml").checked = candidato.skills.html;
    document.getElementById("skillCss").checked = candidato.skills.css;
    document.getElementById("skillJs").checked = candidato.skills.js;
  }

  $('#candidatoModal').modal('show');
}

function obterIdade(dateString) {
  var hoje = new Date();
  const dateparts = dateString.split("/");
  var nascimento = new Date(dateparts[2], dateparts[1] - 1, dateparts[0]);
  var age = hoje.getFullYear() - nascimento.getFullYear();
  var m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    age--;
  }
  return age;
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf == '') return false;
  // Elimina CPFs invalidos conhecidos	
  if (cpf.length != 11 ||
    cpf == "00000000000" ||
    cpf == "11111111111" ||
    cpf == "22222222222" ||
    cpf == "33333333333" ||
    cpf == "44444444444" ||
    cpf == "55555555555" ||
    cpf == "66666666666" ||
    cpf == "77777777777" ||
    cpf == "88888888888" ||
    cpf == "99999999999")
    return false;
  // Valida 1o digito	
  add = 0;
  for (i = 0; i < 9; i++)
    add += parseInt(cpf.charAt(i)) * (10 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11)
    rev = 0;
  if (rev != parseInt(cpf.charAt(9)))
    return false;
  // Valida 2o digito	
  add = 0;
  for (i = 0; i < 10; i++)
    add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11)
    rev = 0;
  if (rev != parseInt(cpf.charAt(10)))
    return false;
  return true;
}

function validarNome(nome) {
  if (nome.indexOf(" ") == -1 || nome.split(' ')[1] === undefined) {
    return false;
  }
  return true;
}

function validarIdade(nascimento) {
  if (obterIdade(nascimento) <= 16) {
    return false;
  }
  return true;
}

function validarHabilidade(habilidades) {
  for (const habilidade of habilidades) {
    if (habilidade) {
      return true;
    }
  }
  return false;
}

function fecharModal() {
  $('#candidatoModal').modal('hide');
  $('body').removeClass('modal-open');
  $('body').removeAttr('style');
  $('.modal-backdrop').remove();

  document.getElementById("id").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("celular").value = "";
  document.getElementById("email").value = "";
  document.getElementById("sexoMasculino").checked = true;
  document.getElementById("nascimento").value = '';
  document.getElementById("skillHtml").checked = false;
  document.getElementById("skillCss").checked = false;
  document.getElementById("skillJs").checked = false;
}

function salvar() {
  let id = document.getElementById("id").value;
  let cpf = document.getElementById("cpf").value;
  let nome = document.getElementById("nome").value;
  let celular = document.getElementById("celular").value;
  let email = document.getElementById("email").value;
  let nascimento = document.getElementById("nascimento").value.split('-').reverse().join('/');
  let sexo = document.getElementById("sexoMasculino").checked;
  let skillHtml = document.getElementById("skillHtml").checked;
  let skillCss = document.getElementById("skillCss").checked;
  let skillJs = document.getElementById("skillJs").checked;

  let erros = []

  if (!cpf || !nome || !celular || !email || !nascimento || isNaN(obterIdade(nascimento))) {
    erros.push("Todos os campos são obrigatórios");
  } else {
    if (!validarCPF(cpf)) {
      erros.push("Cpf inválido");
    }

    if (!validarHabilidade([skillCss, skillHtml, skillJs])) {
      erros.push("Candidato deve ter ao menos uma habilidade")
    }

    if (!validarIdade(nascimento)) {
      erros.push("Candidato deve ser maior de 16 anos")
    }

    if (!validarNome(nome)) {
      erros.push("Nome inválido, candidato deve usar o nome completo");
    }

  }

  if (erros.length > 0) {
    swal(erros.join("\r\n"));
    return;
  }



  let candidato = {
    id: id != '' ? id : new Date().getTime(),
    cpf: cpf,
    nome: nome,
    celular: celular,
    email: email,
    sexo: sexo ? 'Masculino' : 'Feminino',
    nascimento: nascimento,
    skills: {
      html: skillHtml,
      css: skillCss,
      js: skillJs
    }
  };

  if (id != '') {
    let checkCandidato = candidatos.find(e => e.id == candidato.id);
    checkCandidato.cpf = candidato.cpf;
    checkCandidato.nome = candidato.nome;
    checkCandidato.celular = candidato.celular;
    checkCandidato.email = candidato.email;
    checkCandidato.sexo = candidato.sexo;
    checkCandidato.nascimento = candidato.nascimento;
    checkCandidato.skills = candidato.skills;
  } else {
    candidatos.push(candidato);
  }

  localStorage.setItem("candidatos", JSON.stringify(candidatos));


  fecharModal();
  listarCandidatos();
}

function listarCandidatos() {
  let tabela = document.getElementById("table-body");
  tabela.innerHTML = '';

  if (localStorage.getItem("candidatos")) {
    candidatos = JSON.parse(localStorage.getItem("candidatos"));
  }

  for (let [index, candidato] of candidatos.entries()) {
    let linha = document.createElement("tr");
    if (index % 2 === 0) {
      linha.classList.add('secondary-row')
    } else {
      linha.classList.add('primary-row')
    }

    let colunaCpf = document.createElement("td");
    let colunaNome = document.createElement("td");
    let colunaCelular = document.createElement("td");
    let colunaEmail = document.createElement("td");
    let colunaSexo = document.createElement("td");
    let colunaNascimento = document.createElement("td");
    let colunaSkills = document.createElement("td");
    let colunaEditar = document.createElement("td");
    let colunaRemover = document.createElement("td");

    // Funcionalidades botão editar
    let botaoEditar = document.createElement("button");
    botaoEditar.classList.add('btn', 'btn-info');
    botaoEditar.innerHTML = "<i class='fas fa-edit'></i>";
    botaoEditar.onclick = function () {
      console.log('editar');
      abrirModal(candidato);
    }

    // Funcionalidades botão remover
    let botaoRemover = document.createElement("button");
    botaoRemover.classList.add('btn', 'btn-danger');
    botaoRemover.innerHTML = "<i class='fas fa-trash'></i>";
    botaoRemover.onclick = function () {
      candidatos.splice(index, 1);
      localStorage.setItem("candidatos", JSON.stringify(candidatos));
      listarCandidatos();
    }

    let arrSkills = [];
    if (candidato.skills.html) {
      arrSkills.push('HTML');
    }
    if (candidato.skills.css) {
      arrSkills.push('CSS');
    }
    if (candidato.skills.js) {
      arrSkills.push('JS');
    }

    colunaCpf.appendChild(document.createTextNode(candidato.cpf));
    colunaNome.appendChild(document.createTextNode(candidato.nome));
    colunaCelular.appendChild(document.createTextNode(candidato.celular));
    colunaEmail.appendChild(document.createTextNode(candidato.email));
    colunaSexo.appendChild(document.createTextNode(candidato.sexo));
    colunaNascimento.appendChild(document.createTextNode(candidato.nascimento));
    colunaSkills.appendChild(document.createTextNode(arrSkills.join(', ')));
    colunaEditar.appendChild(botaoEditar);
    colunaRemover.appendChild(botaoRemover);

    linha.appendChild(colunaCpf);
    linha.appendChild(colunaNome);
    linha.appendChild(colunaCelular);
    linha.appendChild(colunaEmail);
    linha.appendChild(colunaSexo);
    linha.appendChild(colunaNascimento);
    linha.appendChild(colunaSkills);
    linha.appendChild(colunaEditar);
    linha.appendChild(colunaRemover);

    tabela.appendChild(linha);
  }
}

listarCandidatos();

//Trecho resposável pelo filtro da tabela
$(document).ready(function () {
  $("#search").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#candidatos tbody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
  $('#cpf').mask('000.000.000-00', { reverse: true });
  $('#celular').mask('(00) 00000-0000');
});
