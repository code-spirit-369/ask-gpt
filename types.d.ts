interface Message {
  text: string;
  imageUrl?: string;
  createdAt: Firestore.Timestamp;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
}
