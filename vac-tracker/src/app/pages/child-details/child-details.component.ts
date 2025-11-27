import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

// Define interface for reminder data
interface Reminder {
  childId: string;
  vaccineName: string;
  dueDate: string;
  parentPhone: string;
  status: string;
  createdAt: Date;
}

@Component({
  selector: 'app-child-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './child-details.component.html',
  styleUrls: ['./child-details.component.scss']
})
export class ChildDetailsComponent implements OnInit {
  childId: string | null = null;
  child: any = {};
  reminders: Reminder[] = [];
  displayedColumns: string[] = ['vaccineName', 'dueDate', 'status'];

  constructor(private route: ActivatedRoute, private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    this.childId = this.route.snapshot.paramMap.get('id');
    if (this.childId) {
      this.fetchChildDetails();
      this.fetchReminders();
    } else {
      alert('No child ID provided.');
      this.router.navigate(['/']);
    }
  }

  async fetchChildDetails() {
    try {
      const childRef = doc(this.firestore, 'children', this.childId!);
      const childSnap = await getDoc(childRef);
      if (childSnap.exists()) {
        this.child = childSnap.data();
      } else {
        alert('Child not found.');
        this.router.navigate(['/']);
      }
    } catch (error: any) {
      console.error('Error fetching child:', error);
      alert('Failed to fetch child details: ' + error.message);
    }
  }

  async fetchReminders() {
    try {
      const remindersRef = collection(this.firestore, 'reminders');
      const q = query(remindersRef, where('childId', '==', this.childId!));
      const snapshot = await getDocs(q);
      const uniqueReminders = new Map<string, Reminder>();
      snapshot.docs.forEach(doc => {
        const data = doc.data() as Reminder;
        // Use vaccineName and dueDate as a unique key to avoid duplicates
        const key = `${data['vaccineName']}-${data['dueDate']}`;
        if (!uniqueReminders.has(key)) {
          uniqueReminders.set(key, data);
        }
      });
      this.reminders = Array.from(uniqueReminders.values()).sort((a, b) =>
        new Date(a['dueDate']).getTime() - new Date(b['dueDate']).getTime()
      );
      if (this.reminders.length === 0) {
        alert('No reminders found for this child.');
      }
    } catch (error: any) {
      console.error('Error fetching reminders:', error);
      alert('Failed to fetch reminders: ' + error.message);
    }
  }
}
