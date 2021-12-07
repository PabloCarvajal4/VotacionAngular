import { Component, OnInit } from '@angular/core';
//Formularios reactivos
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Votacion } from 'src/app/models/votacion';
import { VotacionService } from 'src/app/services/votacion.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.css']
})
export class VotacionComponent implements OnInit {
  form!: FormGroup;
  listOfHardware: Votacion[] = [];
  visible = false;
  accion:boolean=true;
  idModificar:string='';

  constructor(
    private hardwareService: VotacionService,
    private nzMessageService: NzMessageService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
   }
   private buildForm() {
    this.form = this.formBuilder.group({
      candidato: [''],
      votos: [''],
      designadoPrincipal: [''],
      partido: [''],
      color: ['']    
    });
  }

  ngOnInit(): void {
    this.hardwareService.getAllVotacion().toPromise().then(
      (data: Votacion[]) => this.listOfHardware = data
    )
  }

  delete(id: string) {
    this.hardwareService.deleteVotacion(id).toPromise().then(() => {
      this.nzMessageService.warning('El registro fue eliminado con exito!');
      this.listOfHardware = this.listOfHardware.filter(x => x.id !== id);
    }, (error) => {
      this.nzMessageService.error('El registro no pudo ser eliminado, por favor intente de nuevo');
      console.error(error);
    })
  }

  cancel(): void {
    this.nzMessageService.info('Su registro sigue activo! =D')
  }

  open(): void {
    this.visible = true;
    this.accion=true;
  }

  close(): void {
    this.visible = false;
    this.buildForm();
  }

  guardar(): void {
    if (this.accion) {
      this.hardwareService.postVotacion(this.form.value).toPromise().then((data: any) => {
        //this.listOfHardware.push(data);
        this.nzMessageService.success('El registro fue ingresado con exito!');
        this.listOfHardware = [...this.listOfHardware, data]
        //Limpia el formulario y lo cierra
        this.buildForm();
        this.visible = false;
      }, (error) => {
        this.nzMessageService.error('El registro no pudo ser ingresado, por favor intente de nuevo');
        console.error(error);
      })
    }else{
      this.hardwareService.putVotacion(this.idModificar,this.form.value).toPromise().then(()=>{
        for(let elemento of this.listOfHardware.filter(x=>x.id===this.idModificar)){
          elemento.candidato=this.form.value.candidato;
          elemento.votos= this.form.value.votos;
          elemento.designadoPrincipal= this.form.value.designadoPrincipal;
          elemento.partido= this.form.value.partido;
          elemento.color=this.form.value.color;
        }
        this.visible = false;
        this.nzMessageService.success('El registro fue actualizado con exito!');
      }, (error) => {
        this.nzMessageService.error('El registro no pudo ser actualizado, por favor intente de nuevo');
        console.error(error);
      })
    }
  }

  modificar(item:Votacion):void{
    this.accion=false;
    this.idModificar=item.id;
    this.visible = true;
    this.form=this.formBuilder.group({
      candidato: [item.candidato],
      votos: [item.votos],
      designadoPrincipal: [item.designadoPrincipal],
      partido: [item.partido],
      color: [item.color]
    })
  }

  submitForm(): void {
    for (const i in this.form?.controls) {
      this.form?.controls[i].markAsDirty();
      this.form?.controls[i].updateValueAndValidity();
    }
  }
}
