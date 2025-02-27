export const toMinutes = (date) => {
    const d = new Date(date);
    return d.getHours() * 60 + d.getMinutes();
};


export const fromMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export const findAvailableSlots = (openingTime, closingTime, bookedSlots, duration) => {
    let available = [];
    let startTime = openingTime;

    bookedSlots.sort((a, b) => a.start - b.start);

    for (let slot of bookedSlots) {
        if (slot.start - startTime >= duration) {
            available.push(fromMinutes(startTime));
        }
        startTime = Math.max(startTime, slot.end);
    }

    if (closingTime - startTime >= duration) {
        available.push(fromMinutes(startTime));
    }

    return available;
};
