export const validateName = (text) => {
    if (!text.trim()) {
        return { valid: false, message: "El nombre es requerido" };
    }
    if (text.length < 3) {
        return { valid: false, message: "El nombre debe tener al menos 3 caracteres" };
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(text)) {
        return { valid: false, message: "El nombre solo puede contener letras" };
    }
    return { valid: true, message: "" };
};

export const validateLastname = (text) => {
    if (!text.trim()) {
        return { valid: false, message: "El apellido es requerido" };
    }
    if (text.length < 2) {
        return { valid: false, message: "El apellido debe tener al menos 2 caracteres" };
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(text)) {
        return { valid: false, message: "El apellido solo puede contener letras" };
    }
    return { valid: true, message: "" };
};

export const validateBirthday = (text) => {
    if (!text.trim()) return { valid: false, message: "La fecha de nacimiento es requerida" };

    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(text)) return { valid: false, message: "Formato inválido (DD/MM/AAAA)" };

    const [dia, mes, anio] = text.split("/").map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    const hoy = new Date();

    if (fecha > hoy) return { valid: false, message: "La fecha no puede ser futura" };

    const edad = hoy.getFullYear() - anio;
    if (edad < 18) return { valid: false, message: "Debe ser mayor de 18 años" };
    if (edad > 50) return { valid: false, message: "Máximo 50 años atrás" };

    return { valid: true, message: "" };
};

export const validatePhone = (text) => {
    if (!text.trim()) return { valid: false, message: "El teléfono es requerido" };

    if (!/^\d{10}$/.test(text)) return { valid: false, message: "Debe tener 10 dígitos" };

    return { valid: true, message: "" };
};

export const validateEmail = (text) => {
    if (!text.trim()) return { valid: false, message: "El correo es requerido" };

    if (text.length > 30)
        return { valid: false, message: "El correo debe tener máximo 30 caracteres" };

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(text)) return { valid: false, message: "Correo inválido" };

    return { valid: true, message: "" };
};

export const validatePassword = (text) => {
    if (!text.trim()) return { valid: false, message: "La contraseña es requerida" };
    if (text.length < 8) return { valid: false, message: "Debe tener 8 caracteres mínimo" };
    if (text.length > 20) return { valid: false, message: "Máximo 20 caracteres" };

    return { valid: true, message: "" };
};

export const validateConfirmPassword = (password, text) => {
    if (!text.trim()) {
        return { valid: false, message: "Debe confirmar la contraseña" };
    }

    if (text !== password) {
        return { valid: false, message: "Las contraseñas no coinciden" };
    }

    return { valid: true, message: "" };
};