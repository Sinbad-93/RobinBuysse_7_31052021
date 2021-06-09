

<template>
<div class="reactions" ref="reactions" > <button @click="findAllReactions">test</button>
        <i :id_db="id_db"  @click="likeFunction(id_db)" 
        class="far fa-heart interactiveIcons"></i> 
        <span v-for="(data,index) in parentReactions"
          :key="data" 
          :index="index"> 
            <span v-if="parentReactions[index].id === id_db">
              {{parentReactions[index].reactions[0]}}
            </span>
        </span>
        <i :id_db="id_db" :index="index" @click="smileFunction()" 
        class="fas fa-grin-beam interactiveIcons"></i> 22
        <i :id_db="id_db" :index="index" @click="smileFunction()" 
        class="far fa-grin-squint-tears interactiveIcons "></i> 12
        <i v-if="adminConnected" 
        class="fas fa-trash-alt interactiveIcons"></i> {{id_db}}
</div>
</template>

<script>


export default {
  name: "Reactions",
  components: {
  },
  props: ['user','index','adminConnected',"id_db"],
  data() {
      return {
        heart : false,
        smile : false,
        laugh : false,
        id_user : null,
        id_parent_publication : null,
        reaction :"",
        parentReactions : []
  }
  },
  methods : {
      // FUNCTIONS --------------------------------,
      testo(){
        var el = this.$refs.reactions.parentNode.parentNode;
        //console.log(el.getAttribute('id_db'));
        this.id_parent_publication = el.getAttribute('id_db');
      },

    // POST REACTIONS ----------------------------------------------
        
    async fetchPostReaction(number) {
        this.id_parent_publication = number;
        this.id_user = this.user.id_user;

        const requestOptions = {
        method : 'POST',
        headers : { "Content-Type": "application/json"},
        body: JSON.stringify({ 
            reaction : this.reaction,
            id_parent_publication : this.id_parent_publication,
            heart : this.heart,
            smile : this.smile,
            laugh : this.laugh,
            id_user : this.id_user
          })};

        let response = await fetch('http://localhost:3000/publish/postReaction', requestOptions);
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            //console.log('not response ok, error : ' + error);
            alert('une erreur innattendue s\'est produite');
            return Promise.reject(error); 
            }
            return await response.json();},

        // publish REACTIONS ----------------
    publishReaction(number){
      this.fetchPostReaction(number).then((data) => {
        console.log(data);

        //this.findAllReactions()
      }).catch(e => console.log(e));},

    // GET REACTIONS ----------------------------------------------

    async fetchGetReactions() {

        let response = await fetch('http://localhost:3000/publish/find_reactions');
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            //console.log('not response ok, error : ' + error);
            alert('une erreur innattendue s\'est produite');
            return Promise.reject(error); 
            }
            return await response.json();},
    
    // display REACTIONS ------------------
    findAllReactions(){
        this.fetchGetReactions().then((data) => {
        this.sortReactions(data);

      }).catch(e => console.log(e));},
      
      smileFunction(){
          if(event.target.style.color === 'rgb(255, 174, 0)'){
              event.target.style.color = 'rgba(0, 0, 0,0.6)'
          }
          else{
              event.target.style.color = 'rgb(255, 174, 0)'
                }
            },

    likeFunction(number){
        this.heart = !this.heart;
        event.target.classList.toggle('fas') ;
        event.target.classList.toggle('far') ;
        event.target.classList.toggle('full-heart');
        //var number = event.target.getAttribute('id_db');
        console.log(number);
        this.reaction = 'heart';
        this.publishReaction(number);
          
      },
      sortReactions(data){

        /* on va récuperer toutes les réactions et on va les trier 
        dans parentReactions pour qu'elles soient regroupés par commentaire */
        console.log(data);
        var countSameId = []
        var reactionsObject = data['data'];
        console.log(reactionsObject[0]['id_parent_publication']);
        reactionsObject.forEach((key) => {
                // 0 : {rdv_date : 'string'}
                // 0 is key and rdv is i
                //console.log(i);
                //console.log(this.parentReactions);
                //console.log(key['id_parent_publication']);
            if (!countSameId.includes(key['id_parent_publication'])){
                countSameId += key['id_parent_publication'];
                this.parentReactions.push({
                id :key['id_parent_publication'], 
                reactions : [
                key['heart'],
                key['smile'],
                key['laugh']
                ],
                user : key['id_user']})
            }
            else {
                //console.log(this.parentReactions);
                this.parentReactions.forEach((index) =>{
                //console.log(index[i]);
                //console.log(key['id_parent_publication']);

                if (index.id === 
                key['id_parent_publication'])
                { 
                    if (key['heart'] === 1 ){
                        index.reactions[0] += 1;
                    }
                    if (key['smile'] === 1 ){
                        index.reactions[1] += 1;
                    }
                    if (key['laugh'] === 1 ){
                        index.reactions[2] += 1;
                    }
                }
            
            
            })
                }
        });
         //console.log(this.parentReactions);
      }

}}
</script>

<style scoped>
@media screen and (max-width : 768px) {

}
</style>