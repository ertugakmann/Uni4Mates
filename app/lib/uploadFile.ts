import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    // Depolama referansı oluştur
    const storageRef = ref(storage, `${path}/${file.name}`);

    // Dosyayı Firebase Storage'a yükle
    const snapshot = await uploadBytes(storageRef, file);

    // Yüklenen dosyanın indirme URL'sini al
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Dosya başarıyla yüklendi:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    throw error;
  }
};

export default uploadFile;
