export const formatCurrency = (value) => {
  const amount = Number(value) || 0;

  return `THB ${amount.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const isValidImageUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  return /^https?:\/\/.+/i.test(trimmed);
};

export const normalizeImageUrl = (url) => {
  const trimmed = (url || "").trim();
  return isValidImageUrl(trimmed) ? trimmed : "";
};

export const getBgColor = (name) => {
  const bgarr = [
    "#b73e3e",
    "#5b45b0",
    "#7f167f",
    "#735f32",
    "#1d2569",
    "#285430",
    "#f6b100",
    "#025cca",
    "#be3e3f",
    "#02ca3a",
  ];
  if (!name) return bgarr[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % bgarr.length;
  return bgarr[index];
};

export const getAvatarName = (name) => {
  if (!name) return "";

  return name.split(" ").map(word => word[0]).join("").toUpperCase();

}

export const formatDate = (date) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
};

export const formatDateAndTime = (date) => {
  const dateAndTime = new Date(date).toLocaleString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Bangkok"
  })

  return dateAndTime;
}

export const filterOrdersByTime = (ordersToFilter, startDate, endDate) => {
  if (!startDate && !endDate) return ordersToFilter;

  return ordersToFilter.filter((order) => {
    const orderDate = new Date(order.createdAt);
    if (isNaN(orderDate)) return true; // fallback if date is invalid or missing

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    // Set start to beginning of day
    if (start) {
      start.setHours(0, 0, 0, 0);
    }
    // Set end to end of day
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    if (start && end) {
      return orderDate >= start && orderDate <= end;
    } else if (start) {
      return orderDate >= start;
    } else if (end) {
      return orderDate <= end;
    }

    return true;
  });
};