import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Observable, first } from 'rxjs';

@Component({
  selector: 'app-child-form',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss']
})
export class ChildFormComponent implements OnInit {
  name = '';
  dob = '';
  parentPhone = '';
  vaccines$!: Observable<any[]>;
  loading = false;

  constructor(private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    const vaccinesRef = collection(this.firestore, 'vaccines');
    this.vaccines$ = collectionData(vaccinesRef, { idField: 'id' });
  }

  async onSubmit() {
    if (!this.name || !this.dob || !this.parentPhone) {
      alert('Please fill all required fields.');
      return;
    }

    this.loading = true;
    try {
      const vaccines = await this.vaccines$.pipe(first()).toPromise();
      if (!vaccines || vaccines.length === 0) {
        throw new Error('No vaccine data available.');
      }

      const colRef = collection(this.firestore, 'children');
      const childDoc = await addDoc(colRef, {
        name: this.name,
        dob: this.dob,
        parentPhone: this.parentPhone,
        createdAt: new Date()
      });

      const dobDate = new Date(this.dob);
      const remindersRef = collection(this.firestore, 'reminders');

      for (const vaccine of vaccines) {
        const dueDate = new Date(dobDate);
        dueDate.setDate(dobDate.getDate() + vaccine.ageInWeeks * 7);
        await addDoc(remindersRef, {
          childId: childDoc.id,
          vaccineName: vaccine.name,
          dueDate: dueDate.toISOString(),
          parentPhone: this.parentPhone,
          status: 'pending',
          createdAt: new Date()
        });
      }

      alert('Child and reminders registered successfully!');
      this.router.navigate(['/child-details', childDoc.id]);
    } catch (error: any) {
      console.error('Error saving child:', error);
      alert('Failed to register child: ' + error.message);
    } finally {
      this.loading = false;
    }
  }
}
