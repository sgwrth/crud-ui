<template>
  <div>
    <h1>WBS Oracle CRUD</h1>
  </div>

  <div>
    <hr>
  </div>

  <div>
    <h2>Add New Item</h2>
    <form v-on:submit.prevent="submitForm">
      <div>
        <label for="name">Name</label><br>
        <input type="text" v-model="formData.name" id="name"><br>

        <label for="price">Price</label><br>
        <input type="text" v-model="formData.price" id="price"><br>

        <label for="quantity">Quantity</label><br>
        <input type="text" v-model="formData.quantity" id="quantity"><br><br>

        <button type="submit">Submit</button><br><br>
      </div>
    </form>
  </div>

  <div>
    <hr>
  </div>

  <div>
    <h2>Show All Data</h2>
    <table cols="4">
      <tr>
        <th>ID</th>
        <th>Bezeichnung</th>
        <th>Anzahl</th>
        <th class="right">Preis / Stk.</th>
        <th class="right">Gesamtpreis</th>
        <th class="end-right"></th>
      </tr>
      <tr v-for="e in allData">
        <td>{{ e.id }}</td>
        <td>{{ e.name }}</td>
        <td>{{ e.quantity }}</td>
        <td class="right">{{ e.price }} EUR</td>
        <td class="right">{{ totalSum(e.quantity, e.price) }} EUR</td>
        <td class="end-right">
          <button v-on:click="delData.id = e.id">Select</button>
        </td>
      </tr>
    </table><br>
  </div>

  <div>
    <hr>
  </div>

  <div>
    <form v-on:submit.prevent="submitDel">
      <h2>Delete Item</h2>
      <table v-if="delData.id">
        <tr>
          <td class="del-left">
            <div><strong>ID:</strong> {{ delData.id }}<input v-show="hidden" class="e-id"
                type="text" v-model="delData.id" id="id" readonly></div>
          </td>
          <td>
            <div><strong>Artikel:</strong> {{ outputString =
                outputSelected(allData, delData) }}</div>
          </td>
          <td class="del-end-right">
            <button v-if="delData.id" class="del"
                type="submit">Delete</button>
          </td>
        </tr>
        </table>
    </form>
  </div>

</template>


<script setup>

import { ref } from 'vue'
import { totalSum } from '../wbs-oracle.ts'

const formData = ref({
  id: '',
  name: '',
  quantity: '',
  price: ''
})

const delData = ref({
  id: ''
})

// Oracle DB:  Alle Produkte auslesen
const { data: allData } = await useFetch('...:8082/products')

// Oracle DB:  Produkt hinzufuegen
const submitForm = async () => {
  const { data: responseData } =
      await useFetch('...:8082/addProduct', {
    method: 'post',
    body: {
      name: formData.value.name,
      quantity: formData.value.quantity,
      price: formData.value.price
    }
  })
  window.location.reload(true)
}

// Oracle DB:  Einzelnes Produkt loeschen
const submitDel = async () => {
  const { data: responseData } =
  await useFetch(`...:8082/delete/${delData.value.id}`, {
    method: 'delete',
    body: {
      id: delData.value.id,
    }
  })
  window.location.reload(true)
}

/**
 * Produkt aus der Liste zum Loeschen auswaehlen.
 * Per ForEach werden alle Prod. durchsucht und auf Uebereinstimmung mit der
 * ID des zum Loeschen ausgewaehlten Prod. geprueft  Bei Treffer werden
 * die ID und die Prod.-Bezeichnung gesondert angezeigt und die Loesch-
 * Methode auf das ausgewaehlte Prod. gerichtet.  (D.h. der Submit des Loesch-
 * Buttons uebersendet die im Input-Feld readonly angegegebene ID der Produkts.)
 * @param {*} all   'allData', alle Prod. aus der DB
 * @param {*} del   'delData', ausgewaehles Produkt 
 */
function outputSelected(all, del) {
  let output
  output = '[empty]'
  all.forEach ((element, index) => {
    if (del.id == element.id) {
      output = element.name
    }
  });
  return output 
}

</script>

<style scoped>
button.del {
  background-color: #f03030;
  color: #ffffff;
  font-weight: bold;
}
input.e-id {
  width: 40px;
  margin-right: 6px;
  text-align: right;
}
.none {
  border: 0px;
}
table {
  width: 75%;
  border-collapse: collapse;
}
td, th {
  border: 1px solid #808080;
  padding: 6px;
  text-align: left;
}
td.right, th.right {
  text-align: right;
}
.del-left {
  width: 80px;
}
.end-right, .del-end-right {
  text-align: center;
  width: 80px;
}
</style>
