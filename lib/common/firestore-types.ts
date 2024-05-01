import { DocumentData, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";

const TestingPostData = [
    {
        id: 'this is the id',
        content: '今天在東京遇到一位可愛的女孩',
        imageURL: 'https://firebasestorage.googleapis.com/v0/b/pic-log-f3ad0.appspot.com/o/users%2FgoujTvBCXEfvSiKDuo1qiA6wLQn1%2Fposts%2F4aEddVerLX6RcSd8PV8F%2F1713887117776.png?alt=media&token=b40962f1-b9b5-4d81-8818-8b5f778f0982',
        createdAt: Timestamp.now()
    },
    {
        id: 'this is the id',
        content: '今天的天氣真好，早上遇到一位跳舞的女孩',
        imageURL: 'https://firebasestorage.googleapis.com/v0/b/pic-log-f3ad0.appspot.com/o/users%2FgoujTvBCXEfvSiKDuo1qiA6wLQn1%2Fposts%2F3vU3V5JvYDc8s4TJQr1r%2F1714086720242.png?alt=media&token=65ad212b-d274-4923-9e22-36160de4e68f',
        createdAt: Timestamp.now()
    },
    {
        id: 'this is the id',
        content: '今天在東京遇到一位可愛的女孩',
        imageURL: 'https://firebasestorage.googleapis.com/v0/b/pic-log-f3ad0.appspot.com/o/users%2FgoujTvBCXEfvSiKDuo1qiA6wLQn1%2Fposts%2FL3VtDwFBoSamHU5wgqnI%2F1713887251842.png?alt=media&token=5f77c8c5-6999-4eac-abf3-8d91271ec616f',
        createdAt: Timestamp.now()
    },
    {
        id: 'this is the id',
        content: '今天在東京遇到一位可愛的女孩',
        imageURL: 'https://firebasestorage.googleapis.com/v0/b/pic-log-f3ad0.appspot.com/o/users%2FgoujTvBCXEfvSiKDuo1qiA6wLQn1%2Fposts%2FiF3UBs9Xf5nQwJ7rW8mx%2F1713887261384.png?alt=media&token=805488d3-4b1e-4d73-aa45-e802cb5700e6',
        createdAt: Timestamp.now()
    },
]

class SharedDoc {
    static Key = {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
}

class PostDoc {
    id: string | undefined = undefined;
    content: string | undefined = undefined;
    imageURL: string | undefined = undefined;
    createdAt: Date | undefined = undefined;
    updatedAt: Date | undefined = undefined;

    // Private constructor to prevent instantiation outside of factory methods
    private constructor(id: string | undefined, data: DocumentData) {
        this.id = id;
        this.content = data.content;
        this.imageURL = data.imageURL;
        if (data.createdAt instanceof Timestamp) {
            this.createdAt = data.createdAt.toDate();
        }
        if (data.updatedAt instanceof Timestamp) {
            this.updatedAt = data.updatedAt.toDate();
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

export { SharedDoc, PostDoc };
