export default {
    data() {
        return {
            magasins: [],
            toEdit: null,
            independantPisteurs: [],
            exportateurs: [],
            receptions: [],
            pisteurs: [],
            produits: [],
            chargements: [],
            livraisons: [],


        }
    },
    methods: {
        getDepenseList() {
            window.models.Depense.find({})
                .populate({
                    path: 'magasin',
                    model: window.models.Magasin,

                })
                .populate({
                    path: 'pisteur',
                    model: window.models.Pisteur,
                })
                .then((res) => {

                    this.depenses = res
                    this.depensesForSearch = res
                    console.log('liste de depenses recuperé avec succès', res)

                })
                .catch((err) => {
                    console.log(err)

                })
        },
        getChargementList(options) {
            if (typeof options == "object") {
                window.models.Chargement.find(options)
                    .populate({
                        path: 'magasin',
                        model: window.models.Magasin
                    })
                    .then((res) => {
                        this.chargements = res
                        console.log('liste de chargements en attente recuperée avec succès', res)
                        if (res.length == 0) {

                            this.modalText = "Il n'y a aucun chargement en attente de livraison. Veuillez en ajouter avant d'ajouter une livraison"
                            this.launchModal('echec')
                            return
                        }

                    })
                    .catch((err) => {
                        console.log(err)

                    })
            }
            else if (typeof options == "string") {
                window.models.Chargement.find({
                    $text: {
                        $search: options
                    },

                })
                    .populate({
                        path: 'magasin',
                        model: window.models.Magasin
                    })
                    .then((res) => {
                        this.chargements = res
                        console.log("liste de chargement recuperée avec succès")

                    })
                    .catch((err) => {
                        console.log(err)

                    })
            } else if (!options) {
                window.models.Chargement.find()
                    .populate({
                        path: 'magasin',
                        model: window.models.Magasin
                    })
                    .populate({
                        path: 'pisteur',
                        model: window.models.Pisteur
                    })
                    .then((res) => {
                        this.chargements = res
                        this.chgtsForSearch = res
                        console.log('liste de chargements  recuperée avec succès', res)

                    })
                    .catch((err) => {
                        console.log(err)

                    })
            }

        },
        getLivraisonList(searchString) {

            if (!searchString) {
                window.models.Livraison.find({})
                    .populate({
                        path: 'chargement',
                        model: window.models.Chargement,

                    })
                    .populate({
                        path: 'exportateur',
                        model: window.models.Exportateur,
                    })
                    .then((res) => {

                        this.livraisons = res
                        this.livraisonsForSearch = res
                        console.log('liste de Livraison recuperé avec succès', res)

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
                    let DateStart = new Date(searchString + "T00:00:00.015Z").toISOString()
                    let DateEnd = new Date(searchString + "T23:59:59.999Z").toISOString()
                    console.log(DateStart)
                    window.models.Livraison.find({ date: { "$gte": DateStart, "$lte": DateEnd } })
                        .populate({
                            path: 'chargement',
                            model: window.models.Chargement,

                        })
                        .populate({
                            path: 'exportateur',
                            model: window.models.Exportateur,
                        })
                        .then((res) => {

                            this.livraisons = res
                            console.log('liste de Livraison recuperé avec succès', res)

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                } else {
                    window.models.Livraison.find({ $text: { $search: searchString } })
                        .populate({
                            path: 'chargement',
                            model: window.models.Chargement,

                        })
                        .populate({
                            path: 'exportateur',
                            model: window.models.Exportateur,
                        })
                        .then((res) => {

                            this.livraisons = res
                            console.log('liste de Livraison recuperé avec succès', res)

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                }

            }
        },
        getGerantList(searchString) {
            this.gerants = []
            if (!searchString) {
                window.models.Magasin.find({})
                    .then((res) => {
                        this.magasins = res
                        res.forEach((el) => {
                            el.gerants.forEach((ger) => {
                                ger.magasin = el.nom
                                this.gerants.push(ger)
                            })

                        })
                        console.log("liste de magasins recuperée avec succès")
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
            else {

                window.models.Magasin.find({ $text: { $search: searchString } })
                    .then((res) => {
                        this.magasins = res

                        res.forEach((el) => {

                            el.gerants.forEach((ger) => {
                                ger.magasin = el.nom
                                console.log(ger.magasin)
                                if (ger.nom.toLowerCase().includes(searchString.toLowerCase())) {
                                    this.gerants.push(ger)
                                }
                                else if (ger.prenom.toLowerCase().includes(searchString.toLowerCase())) {
                                    this.gerants.push(ger)
                                }
                                else if (ger.telephone.toLowerCase().includes(searchString.toLowerCase())) {
                                    this.gerants.push(ger)
                                }
                                else if (ger.magasin.toLowerCase().includes(searchString.toLowerCase())) {
                                    this.gerants.push(ger)
                                }


                            })

                        })
                        console.log("liste gerant dans recherche recuperée avec succès")

                    })
                    .catch((err) => {
                        console.log(err)

                    })
            }


        },
        getProduitList(searchString) {
            if (!searchString) {
                this.produits = []
                this.produitsForSearch = []
                this.magasins.forEach((el) => {
                    el.produits.forEach((prod) => {
                        prod.magasin = el.nom
                        this.produits.push(prod)
                        this.produitsForSearch.push(prod)
                    })


                })
                this.independantPisteurs.forEach((el) => {
                    el.produits.forEach((prod) => {
                        prod.pisteur = el.nom + ' ' + el.prenom
                        this.produits.push(prod)
                        this.produitsForSearch.push(prod)
                    })


                })
                this.produits.forEach((el) => {
                    console.log(el)
                })
            }

        },
        getReceptionList(searchString) {
            if (!searchString) {
                window.models.Transaction.find({})
                    .populate({ path: 'exportateur', model: window.models.Exportateur })
                    .exec((err, docs) => {
                        if (err) {
                            console.log(err)
                            return
                        }

                        this.receptions = docs
                        this.receptionsForSearch = docs
                        console.log("liste de receptions recuperée avec succès", docs)
                    })

            } else {
                let isDate = "Invalid Date"
                if (searchString.length > 4) {
                    isDate = new Date(searchString)
                }

                if (isDate != "Invalid Date") {

                    let DateStart = new Date(searchString + "T00:00:00.015Z").toISOString()
                    let DateEnd = new Date(searchString + "T23:59:59.999Z").toISOString()
                    window.models.Transaction.find({
                        date: {
                            "$gte": DateStart,
                            "$lte": DateEnd
                        },
                        type: "reception"
                    }).populate({ path: 'exportateur', model: window.models.Exportateur })
                        .then((res) => {
                            if (res.length) {
                                this.receptions = res

                                console.log("liste de receptions récupérée", res[0].exportateur)
                            } else {
                                alert("Aucune somme recue le " + isDate.toLocaleDateString())
                            }

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                } else {
                    window.models.Transaction.find({
                        $text: {
                            $search: searchString
                        },

                    })
                        .populate({ path: 'exportateur', model: window.models.Exportateur })
                        .then((res) => {
                            this.receptions = res
                            console.log("liste de recu recuperée avec succès")

                        })
                        .catch((err) => {
                            console.log(err)

                        })

                }
            }
        },
        // getReceptionList() {
        //     window.models.Transaction.find()
        //         // .populate({"path": "exportateur", "model": window.models.Exportateur})
        //         .then((docs) => {

        //             this.receptions = docs
        //         })
        //         .catch((err) => {
        //             console.log(err)
        //         })
        // },
        getPisteurList() {
            window.models.Pisteur.find({})
                .then((docs) => {
                    this.pisteurs = docs
                    this.pisteursForSearch = docs
                    for (var i in this.magasins) {
                        this.magasins[i].pisteurs.forEach(pist => {
                            pist.magasin = this.magasins[i].nom
                            this.pisteurs.push(pist)
                            // this.pisteursForSearch.push(pist)
                        })
                    }
                    
                })
                .catch(err => {
                    console.log(err)
                })
        },
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
        getIndependantPisteurList(searchString) {
            if (!searchString) {
                window.models.Pisteur.find({})
                    .then((res) => {
                        this.independantPisteurs = res
                        console.log('liste de pisteurs independant recuperée avec succès')

                    })
                    .catch((err) => {
                        console.log(err)

                    })
            } else {
                {
                    console.log('search string really string')

                    window.models.Pisteur.find({ $text: { $search: searchString } })
                        .then((res) => {
                            this.independantPisteurs = res
                            console.log('liste de pisteurs independant recuperée avec succès')

                        })
                        .catch((err) => {
                            console.log(err)

                        })
                }

            }

        },
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
                    console.log('Magasin unique recuperé avec succès')

                })
                .catch((err) => {
                    console.log(err)

                })
        }
    },
}