
import { connectToDatabase } from './mongodb';

export type Submission = {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  authorId: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export async function submitContent(submission: Omit<Submission, 'createdAt' | 'status'>): Promise<string | null> {
  try {
    const db = await connectToDatabase();
    const submissionsCollection = db.collection('submissions');
    
    const newSubmission = {
      ...submission,
      createdAt: new Date(),
      status: 'pending'
    };
    
    const result = await submissionsCollection.insertOne(newSubmission);
    
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error submitting content:', error);
    return null;
  }
}

export async function getUserSubmissions(authorId: string): Promise<Submission[]> {
  try {
    const db = await connectToDatabase();
    const submissionsCollection = db.collection('submissions');
    
    const submissions = await submissionsCollection.find({ authorId }).toArray();
    
    return submissions as Submission[];
  } catch (error) {
    console.error('Error getting user submissions:', error);
    return [];
  }
}
