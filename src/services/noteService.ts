import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
    Timestamp,
    orderBy,
  } from "firebase/firestore"
  import { db } from "../lib/firebase"
  
  export interface Note {
    id?: string
    date: string
    text: string
    userId: string
    createdAt: Timestamp
  }
  
  export async function saveNote(note: Omit<Note, "id" | "createdAt">) {
    try {
      const noteData = {
        ...note,
        createdAt: Timestamp.now(),
      }
  
      const docRef = await addDoc(collection(db, "notes"), noteData)
      return { id: docRef.id, ...noteData }
    } catch (error) {
      console.error("Error saving note:", error)
      throw error
    }
  }
  
  export async function updateNote(id: string, text: string) {
    try {
      const noteRef = doc(db, "notes", id)
      await updateDoc(noteRef, { text })
    } catch (error) {
      console.error("Error updating note:", error)
      throw error
    }
  }
  
  export async function deleteNote(id: string) {
    try {
      const noteRef = doc(db, "notes", id)
      await deleteDoc(noteRef)
    } catch (error) {
      console.error("Error deleting note:", error)
      throw error
    }
  }
  
  export async function getUserNotes(userId: string) {
    try {
      const q = query(collection(db, "notes"), where("userId", "==", userId), orderBy("createdAt", "desc"))
  
      const querySnapshot = await getDocs(q)
      const notes: Note[] = []
  
      querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() } as Note)
      })
  
      return notes
    } catch (error) {
      console.error("Error getting user notes:", error)
      throw error
    }
  }
  
  