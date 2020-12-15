import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-json2csv',
  templateUrl: './json2csv.component.html',
  styleUrls: ['./json2csv.component.scss']
})
export class Json2csvComponent implements OnInit {

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
    catch (e){
      this.toastr.warning('O formato inserido para o JSON é inválido.');
      return;
    }

  }

}
