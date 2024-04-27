import { DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";

class PostDoc {
    id: string | undefined = undefined;
    content: string | undefined = undefined;
    imageURL: string | undefined = undefined;
    createdAt: Date | undefined = undefined;

    // Private constructor to prevent instantiation outside of factory methods
    private constructor(id: string | undefined, data: DocumentData) {
        this.id = id;
        this.content = data.content;
        this.imageURL = data.imageURL;
        if (data.createdAt instanceof Timestamp) {
            this.createdAt = data.createdAt.toDate();
        }
    }

    // Factory method for creating a PostDoc from a QueryDocumentSnapshot
    static fromSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>): PostDoc {
        const data = snapshot.data();
        return new PostDoc(snapshot.id, data);
    }

    // Factory method for creating a PostDoc from DocumentData
    static fromData(data: DocumentData): PostDoc {
        return new PostDoc(data.id, data);
    }
}

export { PostDoc };
