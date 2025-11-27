import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreInitService {
  constructor(private firestore: Firestore) {}

  async initializeVaccines() {
    const vaccines = [
      { name: "BCG", ageInWeeks: 0, description: "Tuberculosis vaccine at birth, given as an intradermal injection in the arm" },
      { name: "OPV0", ageInWeeks: 0, description: "Polio vaccine at birth, given as oral drops" },
      { name: "ROTA1", ageInWeeks: 0, description: "Rotavirus vaccine 1st dose at birth, given as oral drops" },
      { name: "OPV1", ageInWeeks: 6, description: "Polio vaccine at 6 weeks, given as oral drops" },
      { name: "DTP1", ageInWeeks: 6, description: "DTP-HepB-Hib at 6 weeks, given as an injection in the thigh" },
      { name: "IPV1", ageInWeeks: 6, description: "Inactivated Polio Vaccine at 6 weeks, given as an injection in the thigh" },
      { name: "ROTA2", ageInWeeks: 6, description: "Rotavirus vaccine 2nd dose at 6 weeks, given as oral drops" },
      { name: "Pneumococcal1", ageInWeeks: 6, description: "Pneumococcal vaccine 1st dose at 6 weeks, given as an injection in the thigh" },
      { name: "OPV2", ageInWeeks: 10, description: "Polio vaccine at 10 weeks, given as oral drops" },
      { name: "DTP2", ageInWeeks: 10, description: "DTP-HepB-Hib at 10 weeks, given as an injection in the thigh" },
      { name: "Pneumococcal2", ageInWeeks: 10, description: "Pneumococcal vaccine 2nd dose at 10 weeks, given as an injection in the thigh" },
      { name: "OPV3", ageInWeeks: 14, description: "Polio vaccine at 14 weeks, given as oral drops" },
      { name: "DTP3", ageInWeeks: 14, description: "DTP-HepB-Hib at 14 weeks, given as an injection in the thigh" },
      { name: "IPV2", ageInWeeks: 14, description: "Inactivated Polio Vaccine at 14 weeks, given as an injection in the thigh" },
      { name: "ROTA3", ageInWeeks: 14, description: "Rotavirus vaccine 3rd dose at 14 weeks, given as oral drops" },
      { name: "Pneumococcal3", ageInWeeks: 14, description: "Pneumococcal vaccine 3rd dose at 14 weeks, given as an injection in the thigh" },
      { name: "Measles1", ageInWeeks: 26, description: "Measles vaccine 1st dose at 6 months, given as an injection in the arm" },
      { name: "Measles2", ageInWeeks: 39, description: "Measles vaccine 2nd dose at 9 months, given as an injection in the arm" },
      { name: "Yellow Fever", ageInWeeks: 39, description: "Yellow Fever vaccine at 9 months, given as an injection in the arm" },
      { name: "Measles3", ageInWeeks: 78, description: "Measles vaccine 3rd dose at 18 months, given as an injection in the arm" }
    ];

    const colRef = collection(this.firestore, 'vaccines');
    for (const vaccine of vaccines) {
      await addDoc(colRef, vaccine);
    }
    console.log('Vaccines initialized');
  }
}
