class CommonUtils {
    static getBase64(file) {
        // Chuyển file image thành kiểu base64 lưu vào database
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        })
    }
}

export default CommonUtils;