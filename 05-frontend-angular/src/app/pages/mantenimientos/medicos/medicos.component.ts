import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from '../../../models/medico.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  private imgSubs: Subscription;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService
  ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe()
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe( img => this.cargarMedicos() );
  }



  buscar( termino: string ){    
    if ( termino.trim().length === 0) {
      return this.medicos = this.medicosTemp;    
    }
    
    this.busquedaService.buscar( 'medicos', termino )
        .subscribe( resp => {
          this.medicos = resp;
        });

  }

  
  cargarMedicos(){

    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
        this.medicosTemp = medicos;
      })
  }

  abrirModal( medico: Medico ){
    this.modalImagenService.abrirModal( 'medicos', medico._id, medico.img );
  }

  borrarMedico( medico: Medico ){

    Swal.fire({
      title: 'Borrar Médico?',
      text: `You are gonna delete ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
                  
          this.medicoService.borrarMedico( medico._id )
            .subscribe( resp => {

              this.cargarMedicos();
              Swal.fire(
                'Medico borrado',
                `${ medico.nombre } fue eliminado correctamente`,
                'success'
              );
            });
        
      }
    })

  }

}

