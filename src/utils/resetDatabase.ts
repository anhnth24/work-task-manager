import { db } from '@/data/db';

/**
 * Reset the entire database and reload the page
 * This will clear all data and reseed with fresh data
 */
export async function resetDatabase(): Promise<void> {
  try {
    // Close the database connection
    db.close();
    
    // Delete the database
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('TaskManagerDB');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    console.log('✅ Database deleted successfully');
    
    // Reload the page to reinitialize with new data
    window.location.reload();
  } catch (error) {
    console.error('❌ Failed to reset database:', error);
  }
}

// Expose globally for easy console access
if (typeof window !== 'undefined') {
  (window as any).resetDatabase = resetDatabase;
}
