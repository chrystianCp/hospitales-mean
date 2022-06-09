import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospital.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedasService,
  ) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();    

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(100) )
      .subscribe( img => this.cargarHospitales() );

  }

  
  buscar( termino: string ){    
    if ( termino.trim().length === 0) {
      return this.hospitales = this.hospitalesTemp;    
    }
    
    this.busquedaService.buscar( 'hospitales', termino)
        .subscribe( resp => {
          this.hospitales = resp;          
        });

  }

  cargarHospitales(){
    
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe( hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
        this.hospitalesTemp = hospitales;
      })
  }

  guardarCambios( hospital: Hospital ) {
    
    this.hospitalService.actualizarHospital( hospital._id, hospital.nombre )
    .subscribe( resp => {
          Swal.fire( 'Actualizado', hospital.nombre, 'success' );
        });

  }
  
  eliminarHospital( hospital: Hospital ) {
    
    this.hospitalService.borrarHospital( hospital._id )
    .subscribe( resp => {
      this.cargarHospitales();
      Swal.fire( 'Borrado', hospital.nombre, 'success' );
    });

  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nomber del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
    })

    if( value.trim().length > 4 ) {      
      this.hospitalService.crearHospital( value )
        .subscribe( (resp: any) => {
          this.hospitales.push( resp.hospital );
        });
    }else if (value.length <= 4) {
      Swal.fire( 'Escriba el nombre del hospital', 'escriba un nombre de al menos 5 caracteres', 'error');
    }else{
      Swal.fire( 'Escriba el nombre del hospital', 'campo vacio', 'error');
    }
  }

  abrirModal( hospital: Hospital ){
    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img );
  }





}
