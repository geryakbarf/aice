var app = new Vue({
    el: '#form-divisi',
    data: {
        form: {
            id: null,
            nama: "Gery"
        }
    }, //enddata
    methods: {
        onSave: async function () {
            if (this.form.nama === "") {
                toastr.error("Harap isi nama Divisi!")
                return
            }
            toastr.info("Harap Tunggu...")
            if (this.form.id === null) {
                //Method Insert
                let result = await fetch('/api/divisi', {
                    method: 'POST',
                    body: JSON.stringify(this.form),
                    headers: {'Content-Type': "application/json"}
                })
                let data = await result.json()
                if (data.code > 0) {
                    toastr.success(data.message)
                    setTimeout(() => {
                        let context = this
                        window.removeEventListener('beforeunload', context.leaving, true)
                        window.location = "/admin/divisi"
                    }, 1000)
                } else
                    toastr.error(data.message)
            } else {
                //Method Update
                let result = await fetch('/api/divisi', {
                    method: 'PUT',
                    body: JSON.stringify(this.form),
                    headers: {'Content-Type': "application/json"}
                })
                let data = await result.json()
                if (data.code > 0) {
                    toastr.success(data.message)
                    setTimeout(() => {
                        let context = this
                        window.removeEventListener('beforeunload', context.leaving, true)
                        window.location = "/admin/divisi"
                    }, 1000)
                } else
                    toastr.error(data.message)
            }
        },
        loadDataDivisi: async function () {
            if (!_id)
                return
            else {
                let result = await fetch(`/api/divisi/${_id}`)
                let data = await result.json()
                if (data.code > 0)
                    this.form = data.data
                else
                    toastr.error(data.message)
            }
        }
    },//endmethods
    mounted() {
        this.loadDataDivisi()
    }
})