const url = "http://localhost:3000";

export const handlePopup = async (
  path: string,
  expectedType: string,
  messageData?: any
) => {
  const width = 400;
  const height = 600;
  const left = window.screenX + (window.innerWidth - width) / 2;
  const top = window.screenY + (window.innerHeight - height) / 2;

  const popup = window.open(
    `${url}/${path}`,
    "_blank",
    `width=${width},height=${height},top=${top},left=${left}`
  );

  if (!popup) {
    throw new Error("Popup blocked");
  }

  return new Promise<any>((resolve, reject) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== url) {
        return;
      }

      if (
        event.data &&
        event.data.type === "status" &&
        event.data.status === "ready" &&
        messageData
      ) {
        popup.postMessage(messageData, "*");
      } else if (event.data && event.data[expectedType]) {
        window.removeEventListener("message", handleMessage);
        resolve(event.data[expectedType]);
        popup.close();
      }
    };

    window.addEventListener("message", handleMessage);

    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        window.removeEventListener("message", handleMessage);
        reject(new Error("Popup closed by user"));
      }
    }, 500);
  });
};
