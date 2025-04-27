
import { connectToDatabase } from './mongodb';

export type Bookmark = {
  userId: string;
  contentId: string;
  createdAt: Date;
}

export async function addBookmark(userId: string, contentId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    const db = await connectToDatabase();
    const bookmarksCollection = db.collection('bookmarks');
    
    // Check if the bookmark already exists
    const existingBookmark = await bookmarksCollection.findOne({
      userId,
      contentId
    });
    
    if (existingBookmark) {
      return false;
    }
    
    const result = await bookmarksCollection.insertOne({
      userId,
      contentId,
      createdAt: new Date()
    });
    
    return result.acknowledged;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return false;
  }
}

export async function removeBookmark(userId: string, contentId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    const db = await connectToDatabase();
    const bookmarksCollection = db.collection('bookmarks');
    
    const result = await bookmarksCollection.deleteOne({
      userId,
      contentId
    });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
}

export async function getUserBookmarks(userId: string): Promise<string[]> {
  if (!userId) return [];
  
  try {
    const db = await connectToDatabase();
    const bookmarksCollection = db.collection('bookmarks');
    
    const bookmarks = await bookmarksCollection.find({ userId }).toArray();
    
    return bookmarks.map((bookmark: any) => bookmark.contentId);
  } catch (error) {
    console.error('Error getting user bookmarks:', error);
    return [];
  }
}

export async function isContentBookmarked(userId: string, contentId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    const db = await connectToDatabase();
    const bookmarksCollection = db.collection('bookmarks');
    
    const bookmark = await bookmarksCollection.findOne({
      userId,
      contentId
    });
    
    return !!bookmark;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
}
