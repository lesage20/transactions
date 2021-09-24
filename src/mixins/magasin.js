export default {
    data() {
        return {
            magasins: [],
            toEdit: null,
            independantPisteurs: [],
            exportateurs: []

        }
    },
    methods: {
        getExportateurList(searchString) {
            if (!searchString) {
                window.models.Exportateur.find({})
                    .then((res) => {
                        this.exportateurs = res
                        console.log("liste d'exportateurs recuperée avec succès")

                    })
                    .catch((err) => {
                        console.log(err)

                    })
            } else {
                console.log(searchString)
                let isDate = "Invalid Date"
                if (searchString.length > 4) {
                    isDate = new Date(searchString)
                }

                if (isDate != "Invalid Date") {

                    let DateStart = new Date(searchString + "T00:00:00.015Z").toISOString()
                    let DateEnd = new Date(searchString + "T23:59:59.999Z").toISOString()
                    console.log(DateStart)
                    window.models.Exportateur.find({ createdAt: { "$gte": DateStart, "$lte": DateEnd } })
                        .then((res) => {
                            if (res.length) {
                                this.exportateurs = res

                                console.log("liste d'exportateurs récupérée")
                            }
                            else {
                                alert("Aucun exportateur enregistré le " + isDate.toLocaleDateString())
                            }

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                } else {
                    window.models.Exportateur.find({ $text: { $search: searchString } })
                        .then((res) => {
                            this.exportateurs = res
                            console.log("liste d'exportateurs recuperée avec succès")

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                }

            }

        },
        getIndependantPisteurList() {
            window.models.Pisteur.find({})
                .then((res) => {
                    this.independantPisteurs = res
                    console.log('liste de pisteurs independant recuperée avec succès')

                })
                .catch((err) => {
                    console.log(err)

                })

        },
        // getMagasinList(searchString) {
        //     window.models.Magasin.find({})
        //         .then((res) => {
        //             this.magasins = res
        //             console.log('liste de magasins recuperé avec succès')

        //         })
        //         .catch((err) => {
        //             console.log(err)

        //         })

        // },
        getMagasinList(searchString) {
            console.log(searchString)
            if (!searchString) {
                window.models.Magasin.find({})
                    .then((res) => {
                        this.magasins = res
                        console.log("liste de magasins recuperée avec succès")


                    })
                    .catch((err) => {
                        console.log(err)

                    })
            } else {
                let isDate = "Invalid Date"
                if (searchString.length > 4) {
                    isDate = new Date(searchString)
                }

                if (isDate != "Invalid Date") {
                    console.log('search string is date')


                    let DateStart = new Date(searchString + "T00:00:00.015Z").toISOString()
                    let DateEnd = new Date(searchString + "T23:59:59.999Z").toISOString()
                    console.log(DateStart)
                    window.models.Magasin.find({ createdAt: { "$gte": DateStart, "$lte": DateEnd } })
                        .then((res) => {
                            if (res.length) {
                                this.magasins = res

                                console.log("liste de magasins récupérée")
                            }
                            else {
                                alert("Aucun magasin enregistré le " + isDate.toLocaleDateString())
                            }

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                } else {
                console.log('search string really string')

                    window.models.Magasin.find({ $text: { $search: searchString } })
                        .then((res) => {
                            this.magasins = res
                            console.log("liste magasin recuperée avec succès")

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                }

            }

        },
        getOneMagasin(options) {
            window.models.Magasin.findOne({ options })
                .then((res) => {
                    this.toEdit = res
                    console.log('liste de magasins recuperé avec succès')

                })
                .catch((err) => {
                    console.log(err)

                })
        }
    },
}