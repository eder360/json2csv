import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-json2csv',
  templateUrl: './json2csv.component.html',
  styleUrls: ['./json2csv.component.scss']
})
export class Json2csvComponent implements OnInit {
  public textArea1: string;
  public textArea2: string;

  columnDefs = [];
  rowData = [];

  constructor(private toastr: ToastrService) { }

  ngOnInit(): void {

  }

  jsonCSV() {
    // Valor do textArea de entrada
    var entrada = (<HTMLInputElement>document.getElementById("textArea1")).value;

    if (entrada == "") {
      this.toastr.info('O campo de entrada não pode estar vazio.');
      return;
    }

    // Verifica se o formato JSON foi inserido corretamente
    try {
      var jsonVal = JSON.parse(entrada);
    }
    catch (e) {
      this.toastr.warning('O formato inserido para o JSON é inválido.');
      return;
    }

    // Vetor auxiliar para validar as propriedades do objeto
    try {
      var validador = Object.keys(jsonVal[0]);
    }
    catch (e) {
      this.toastr.warning('Não é possível a conversão de estruturas aninhadas.');
      return;
    }

    // Vetor que obtem os valores dos atributos para conversão
    let vetValores = [];

    for (let i = 0; i < jsonVal.length; i++) {
      var vetProp = Object.keys(jsonVal[i]);
      if (!vetIguais(validador, vetProp)) {
        if (confirm("As propriedades do JSON não estão indênticas, deseja coninuar?")) {
          this.convertePropDif(jsonVal);
          return;
        } else {
          return;
        }
      } else {
        // String auxiliar que obtem as linhas dos valores do JSON
        let linha = "";

        // Formata os valores para CSV
        Object.keys(jsonVal[i]).forEach((key) => {
          if (isNaN(jsonVal[i][key])) {
            linha = linha + '"' + jsonVal[i][key] + '"' + ',';
          } else {
            linha = linha + jsonVal[i][key] + ',';
          }
        });

        linha = linha.substring(0, linha.length - 1); // Remove a vigula e aspas no final da string
        vetValores.push(linha); // Adiciona a linha formatada a um array
      }
    }
    this.inserirTextArea(validador, vetValores);
    this.gerarTabela(validador, jsonVal);
  }

  inserirTextArea(coluna, valores) {
    let formataColunas = "";

    //Adicona vigula nas colunas
    for (let i = 0; i < coluna.length; i++) {
      formataColunas = formataColunas + coluna[i] + ',';
    }

    formataColunas = formataColunas.substring(0, formataColunas.length - 1); // Remove a vigula no final da string

    // Quebra a linha dos dados da coluna
    this.textArea2 = formataColunas + '\n';

    // Quebra a linha dos dados das linhas
    for (let i = 0; i < valores.length; i++) {
      this.textArea2 = this.textArea2 + valores[i] + '\n';
    }
  }

  // Funcao responsavel por converter para CSV caso as colunas sejam diferentes
  convertePropDif(jsonVal) {
    // Vetor auxiliar para salvar os dados das colunas
    let vetColunas = [];
    // Vetor auxiliar para salvar as propriedades das colunas
    let vetProp = [];

    // Armazena todas as propriedades do JSON
    for (let i = 0; i < jsonVal.length; i++) {
      vetColunas.push(Object.keys(jsonVal[i]));
      for (let j = 0; j < vetColunas[i].length; j++) {
        vetProp.push(vetColunas[i][j]);
      }
    }

    // Remove todas as propriedades repetidas
    var vetColunaFormatado = vetProp.filter(function (dado, i) {
      return vetProp.indexOf(dado) === i;
    });


    // String auxiliar que obtem as linhas dos valores do JSON
    let linha = "";

    // Vetor auxiliar que recebe as linhas do JSON formatadas
    let vetLinha = [];

    for (let i = 0; i < jsonVal.length; i++) {
      for (let j = 0; j < vetColunaFormatado.length; j++) {

        // Contador que verifica se uma linha tem todas as colunas
        let cont = 0;

        // Converte para CSV
        Object.keys(jsonVal[i]).forEach((key) => {
          if (vetColunaFormatado[j] == key) {
            if (isNaN(jsonVal[i][key])) {
              linha = linha + '"' + jsonVal[i][key] + '"' + ',';
            } else {
              linha = linha + jsonVal[i][key] + ',';
            }
          } else {
            cont++;
          }
        });
        // Contador para verificar colunas em branco
        let contProp = Object.keys(jsonVal[i]);
        // Adicona o separador de dados
        if (cont == contProp.length) {
          linha = linha + ',';
        }
      }
      linha = linha.substring(0, linha.length - 1); // Remove a vigula no final da string
      vetLinha.push(linha);
      linha = "";
    }

    this.inserirTextArea(vetColunaFormatado, vetLinha);
    this.gerarTabela(vetColunaFormatado, jsonVal);
  }

  gerarTabela(coluna, linhas) {
    let vetColuna = [];
    for (let i = 0; i < coluna.length; i++) {
      vetColuna.push({ 'field': coluna[i] });
    }

    this.columnDefs = vetColuna;
    this.rowData = linhas;
  }

  Limpar() {
    this.textArea1 = "";
    this.textArea2 = "";
    this.columnDefs = [];
    this.rowData = [];
  }

}

// Verifica se todas as chaves do json são identicas
function vetIguais(validador, vetProp) {
  if (validador.length !== vetProp.length) {
    return false;
  } else {
    for (let i = 0; i < validador.length; i++) {
      if (validador[i] != vetProp[i]) {
        return false;
      }
    }
  }
  return true;
}
