var app = new Vue({
    el: '#form-bagian',
    data: {
        form: {
            id: null,
            id_divisi: 0,
            nama: "",
            lembur: "Tidak",
            jam_masuk: "",
            jam_keluar: "",
            jobdesk: ""
        },
        divisi: []
    }, //enddata
    methods: {
        loadDivisi: async function () {
            try {
                let result = await fetch('/api/divisi')
                let data = await result.json()
                if (data.code > 0)
                    this.divisi = data.data
                else
                    toastr.error(data.message)
            } catch (e) {
                console.log(e)
            }
        },
        isNotValid: function () {
            let status = false
            if (this.form.id_divisi <= 0)
                status = true
            if (this.form.nama === "")
                status = true
            if (this.form.lembur === "")
                status = true
            if (this.form.jam_masuk === "")
                status = true
            if (this.form.jam_keluar === "")
                status = true
            return status
        },
        onSave: async function () {
            try {
                if (this.form.id === null) {
                    //Method Insert
                    if (this.isNotValid()) {
                        toastr.warning("Harap isi semua form yang wajib diisi!")
                        return
                    }
                    let formData = this.form
                    let result = await fetch('/api/bagian', {
                        method: 'POST',
                        body: JSON.stringify(formData),
                        headers: {'Content-Type': "application/json"}
                    })
                    let data = await result.json()
                    if (data.code > 0) {
                        toastr.success(data.message)
                        setTimeout(() => {
                            let context = this
                            window.removeEventListener('beforeunload', context.leaving, true)
                            window.location = "/admin/bagian"
                        }, 1000)
                    } else
                        toastr.error(data.message)
                    //endif
                } else {
                    //TODO logika saat update bagian
                }
            } catch (e) {
                console.log(e)
            }
        }
    }, //endmethods
    mounted() {
        this.loadDivisi()
    } //endmounted
})