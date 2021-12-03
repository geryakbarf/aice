var app = new Vue({
    el: '#main-absensi',
    data: {},
    methods: {
        addMainAbsensi: async function () {
            try {
                const res = await fetch('/api/main-absensi', {
                    method: 'POST',
                    headers: {'Content-Type': "application/json"}
                });
                const data = await res.json()
                if (data.code > 0) {
                    toastr.success(data.message)
                    setTimeout(() => {
                        window.removeEventListener('beforeunload', this.leaving, true)
                        window.location = "/admin/absensi/"
                    }, 1000)
                } else
                    toastr.error(data.message)
            } catch (e) {
                console.log(e)
            }
        },
    },
    mounted() {
    }
})