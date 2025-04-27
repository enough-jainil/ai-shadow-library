
import { connectToDatabase } from './mongodb';

export type Bookmark = {
  userId: string;
  contentId: string;
  createdAt: Date;
}

export async function addBookmark(userId: string, contentId: string): Promise<boolean> {
  try {
    const db = await connectToDatabase();
    const bookmarksCollection = db.collection('bookmarks');
    
    // Check if the bookmark already exists
    const existingBookmark = await bookmarksCollection.findOne();
    
    if (existingBookmark) {
      return false; // Bookmark already exists
    }
    
    // Add new bookmark
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
  try {
    const db = await connectToDatabase();
    const bookmarksCollection = db.collection('bookmarks');
    
    const result = await bookmarksCollection.deleteOne();
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
}

export async function getUserBookmarks(userId: string): Promise<string[]> {
  try {
    const db = await connectToDatabase();
    const bookmarksCollection = db.collection('bookmarks');
    
    const bookmarks = await bookmarksCollection.find().toArray();
    
    return bookmarks.map((bookmark: any) => bookmark.contentId);
  } catch (error) {
    console.error('Error getting user bookmarks:', error);
    return [];
  }
}

export async function isContentBookmarked(userId: string, contentId: string): Promise<boolean> {
  try {
    const db = await connectToDatabase();
    const bookmarksCollection = db.collection('bookmarks');
    
    const bookmark = await bookmarksCollection.findOne();
    
    return !!bookmark;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
}
