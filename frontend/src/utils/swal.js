import Swal from 'sweetalert2';

export const swalConfirm = async (title, text, confirmButtonText = 'Yes, Proceed') => {
    return Swal.fire({
        title: title || 'Are you sure?',
        text: text || "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        background: '#0a0a0a',
        color: '#ffffff',
        confirmButtonColor: '#10b981', // Emerald 500
        cancelButtonColor: '#3f3f46', // Zinc 700
        confirmButtonText: confirmButtonText,
        customClass: {
            popup: 'rounded-[2rem] border border-white/10 backdrop-blur-3xl shadow-2xl',
            title: 'font-black uppercase tracking-widest text-xl',
            htmlContainer: 'text-muted font-medium',
            confirmButton: 'rounded-xl px-8 py-4 font-black text-[10px] uppercase tracking-widest transition-transform active:scale-95',
            cancelButton: 'rounded-xl px-8 py-4 font-black text-[10px] uppercase tracking-widest transition-transform active:scale-95'
        }
    });
};

export const swalAlert = (title, text, icon = 'info') => {
    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        background: '#0a0a0a',
        color: '#ffffff',
        confirmButtonColor: '#10b981',
        customClass: {
            popup: 'rounded-[2rem] border border-white/10 backdrop-blur-3xl shadow-2xl',
            title: 'font-black uppercase tracking-widest text-xl',
            htmlContainer: 'text-muted font-medium',
            confirmButton: 'rounded-xl px-8 py-4 font-black text-[10px] uppercase tracking-widest transition-transform active:scale-95'
        }
    });
};
