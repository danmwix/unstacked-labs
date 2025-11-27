import admin from "firebase-admin";
import fs from "fs";

// Read the service account manually
const serviceAccount = JSON.parse(
  fs.readFileSync("./vac-tracker-app-eac07-firebase-adminsdk-fbsvc-d0d5135cbb.json", "utf8")
);


// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function setupFaqs() {
  const faqsData = [
    { id: 'bcg', question: 'What is BCG vaccine?', answer: "BCG is given at birth to protect against tuberculosis. It's an intradermal injection in the arm." },
    { id: 'opv', question: 'When is OPV given?', answer: 'OPV is given at birth, 6 weeks, 10 weeks, and 14 weeks as oral drops.' },
    { id: 'dtp', question: 'What is DTP vaccine?', answer: 'DTP-HepB-Hib is given at 6, 10, and 14 weeks as an injection in the thigh.' },
    { id: 'measles', question: 'When is Measles vaccine given?', answer: 'Measles is given at 6 months, 9 months, and 18 months as an injection in the arm.' },
    { id: 'yellowfever', question: 'What is Yellow Fever vaccine?', answer: 'Yellow Fever is given at 9 months as an injection in the arm to prevent the disease.' },
  ];

  const faqsRef = db.collection('faqs');

  for (const faq of faqsData) {
    await faqsRef.doc(faq.id).set(faq);
    console.log(`Added FAQ: ${faq.question}`);
  }

  console.log('FAQ setup complete!');
}

setupFaqs().catch(console.error);
