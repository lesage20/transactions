<template>
<div id="app" class="col-sm-12">
    <div class="offset">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>User ID</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="p in displayedPosts" :key="p">
                    <td>{{p.first}}</td>
                    <td>{{p.last}}</td>
                    <td>{{p.suffix}}</td>
                </tr>
            </tbody>
        </table>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item">
                    <button type="button" class="page-link" v-if="page != 1" @click="page--"> Previous </button>
                </li>
                <li class="page-item">
                    <button type="button" class="page-link" v-for="pageNumber in pages.slice(page-1, page+5)" @click="page = pageNumber" :key="pageNumber"> {{pageNumber}} </button>
                </li>
                <li class="page-item">
                    <button type="button" @click="page++" v-if="page < pages.length" class="page-link"> Next </button>
                </li>
            </ul>
        </nav>
    </div>
</div>
</template>

<script>
export default {
    name: "pagination",
    data() {
        return {
            posts: [''],
            page: 1,
            perPage: 9,
            pages: [],
        }
    },
    methods: {
        getPosts() {
            let data = [];
            for (let i = 0; i < 50; i++) {
                this.posts.push({
                    first: 'John',
                    last: 'Doe',
                    suffix: '#' + i
                });
            }
        },
        setPages() {
            let numberOfPages = Math.ceil(this.posts.length / this.perPage);
            for (let index = 1; index <= numberOfPages; index++) {
                this.pages.push(index);
            }
        },
        paginate(posts) {
            let page = this.page;
            let perPage = this.perPage;
            let from = (page * perPage) - perPage;
            let to = (page * perPage);
            return posts.slice(from, to);
        }
    },
    computed: {
        displayedPosts() {
            return this.paginate(this.posts);
        }
    },
    watch: {
        posts() {
            this.setPages();
        }
    },
    created() {
        this.getPosts();
    },
    filters: {
        trimWords(value) {
            return value.split(" ").splice(0, 20).join(" ") + '...';
        }
    }
}
</script>

<style scoped>
button.page-link {
    display: inline-block;
}

button.page-link {
    font-size: 20px;
    color: #29b3ed;
    font-weight: 500;
}

.offset {
    width: 500px !important;
    margin: 20px auto;
}
</style>
