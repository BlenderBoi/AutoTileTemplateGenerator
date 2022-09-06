
function util_set_visibility(item, state){

  if (state){
    item.classList.remove("hidden")
  }else{
    item.classList.add("hidden")
  }
}









class InterfaceItem {
  constructor(id){
    this.id = id
    this.name = id.replace("-", "_")
    this.item = document.getElementById(id)
  }
}

class PanelItem extends InterfaceItem {
  
  set_visibility(state){
    util_set_visibility(this.item, state)
  }

}



function create(tag, parent, classname){

  let item = document.createElement(tag)
  parent.appendChild(item)
  item.classList.add(classname)
  return item

}

class TileItems extends InterfaceItem{

  constructor(id){
    super(id)
    this.tiles = []
  }

  add_tile(path, name, cells_data){
    let tile = new TileItem(path, name, this.item, cells_data)
    this.tiles.push(tile)
  }



}


// class crop_object {
//   top: 0
//   bottom: 0 
//   left: 0
//   right: 0
// }










class TileItem{

  constructor(path, name, parent, cell_datas){
    let tile_item = create("div", parent, "tile-item")


    let image_container = create("div",tile_item ,"image-container")

    let file_input = create("input", tile_item, "hidden")
    file_input.type = "file"

    let source_image = create("img",image_container ,"source-image")
    source_image.src = path
    let tile_name = create("span", tile_item, "tile-name")

    tile_item.onclick = ()=>{
      file_input.click()
    }

    file_input.onchange = (e) => {
      source_image.src = URL.createObjectURL(file_input.files[0])
      
    }
    source_image.onload = (e) => {

      app.draw_tiles()

    }


    tile_name.innerHTML = name

    this.item = tile_item
    this.image = source_image
    this.cell_datas = cell_datas
  }

}




class SettingItem extends InterfaceItem {

  constructor(id){
    super(id)
    this.container = this.item.parentElement
    this.label = this.container.childNodes[0]
  }

  set_label(name){
    this.label.textContent = name
  }
  get_label(){
    return this.label.textContent
  }
  get_value(){
    if (this.item.type === "checkbox"){
      return this.item.checked
    }
    else{
      return this.item.value
    }

  }

  
  set_visibility(state){
    util_set_visibility(this.container, state)
  }

}


// cell_datas = [id, [crop_left, crop_top, crop_right...]]

class cell_data{

  constructor(id, clip){
    this.id = id
    this.clip = clip 
  }

  clip(pos_x, pos_y, width, height, rate){

    // top_left = pos_x
    // bottom_left = pox_y
    // top_right = width
    // bottom_right = height

    // if (this.clip == "top"){
    //   pos_y + height / rate
    // }



  

  }


}


class Utility{
    constructor(app){

      this.app = app

    }

    tile_width(){
      let width = this.app.settings.tile_width.get_value()
      return width
    }

    tile_height(){
      let height = this.app.settings.tile_height.get_value()
      return height
    }

    tile_columns(){
        let columns = this.app.settings.tile_column.get_value()
        return columns
    }
    tile_rows(){
        let rows = this.app.settings.tile_row.get_value()
        return rows 
    }

    total_width(){
      let width = this.tile_width()
      let columns = this.tile_columns()
      let total_width = columns * width
      return total_width
    }

    total_height(){
      let rows = this.tile_rows()
      let height = this.tile_height()
      let total_height = rows * height
      return total_height
    }




}
class Cell{
  constructor(index, cell_x, cell_y, width, height, pos_x, pos_y){

    this.index = index
    this.cell_x = cell_x
    this.cell_y = cell_y
    this.width = width 
    this.height = height
    this.pos_x = pos_x
    this.pos_y = pos_y

  }

  sync_data(app){
    this.width = app.utility.tile_width()
    this.height = app.utility.tile_height()
    this.pos_x = this.cell_x * width
    this.pos_y = this.cell_y * height
  }

  draw(app, show_grid, show_index, show_coordinate){

    let ctx = app.ctx

    for (tile in app.tiles){
      console.log(tile)
    }

    // if (show_coordinate){
    //   this.draw_coordinate(ctx)
    // }
    // if (show_grid){
    //   this.draw_grid(ctx)
    // }
    // if (show_index){
    //   this.draw_index(ctx)
    // }

  }


  draw_grid(ctx){

    let pos_x = this.pos_x
    let pos_y = this.pos_y
    let width = this.width
    let height = this.height

    ctx.lineWidth = 1;
    ctx.strokeRect(pos_x, pos_y, width, height);
  }


  draw_coordinate(ctx){

    let pos_x = this.pos_x
    let pos_y = this.pos_y
    let width = this.width
    let height = this.height
    let cell_x = this.cell_x
    let cell_y = this.cell_y


    let font_size = width / 10
    ctx.font = "" + font_size + "px Arial";
    ctx.textAlign="center"
    ctx.textBaseline="middle"
    let coordinate_text = "( " + cell_x+  ", " + cell_y +  " )"
    // ctx.fillText(coordinate_text, pos_x + width / 2 , pos_y + height / 2); 
    ctx.fillText(coordinate_text, pos_x + width / 2 , pos_y + height / 2); 
  }

  draw_index(ctx){


    let pos_x = this.pos_x
    let pos_y = this.pos_y
    let width = this.width
    let height = this.height
    let cell_x = this.cell_x
    let cell_y = this.cell_y


    let font_size = width / 10
    ctx.font = "" + font_size + "px Arial";
    ctx.textAlign="center"
    ctx.textBaseline="middle"
    let coordinate_text = this.index
    ctx.fillText(coordinate_text, pos_x + width / 10, pos_y + height / 10); 

  }



}


class App{
  constructor(){

    this.utility = new Utility(this)

    this.panels = {}
    this.panels.tiles = new PanelItem("tiles-panel")
    this.panels.settings = new PanelItem("settings-panel")
    this.panels.viewport = new PanelItem("viewport-panel")
    this.panels.sliced_tiles = new PanelItem("sliced-tiles-panel")

    this.datas = {}
    this.datas.tiles = new TileItems("tiles-items")
    this.datas.sliced_tiles = new TileItems("sliced-tiles")


    this.buttons = {}
    this.buttons.increase_resolution = new TileItems("increase-resolution")
    this.buttons.decrease_resolution = new TileItems("decrease-resolution")
    this.buttons.refresh = new TileItems("refresh")


    // tile_ids= [
    // ["Outer Top Left", [0, 1, 8, 36, 37]],
    // ["Outer Top Right", [0, 3, 11, 36, 39]],
    // ["Outer Bottom Left", [24, 25, 36, 37, 44]],
    // ["Outer Bottom Right", [24, 27, 36, 39, 47]],
    // ["Inner Bottom Right", [ 1,  2,  6, 13, 14, 21, 23, 28, 30, 46, 40, 4, 7]],
    // ["Inner Bottom Left",    [ 2,  3,  5, 14, 15, 29, 31, 32, 34, 46, 43, 4, 7]],
    // ["Inner Top Right",      [ 9, 13, 14, 16, 18, 23, 25, 26, 34, 40, 43, 4, 42]],
    // ["Inner Top Left",       [ 9, 14, 15, 17, 19, 21, 26, 27, 32, 40, 43, 7, 41]],
    // ["Top Edge",       [ 0,  1,  2,  3,  5,  6,  8, 10, 11, 36, 37, 38, 39]],
    // ["Bottom Edge",    [24, 25, 26, 27, 36, 37, 38, 39, 41, 42, 44, 45, 47]],
    // ["Left Edge",      [ 0,  1,  8, 12, 13, 16, 20, 24, 25, 28, 36, 37, 44]],
    // ["Right Edge",     [ 0,  3, 11, 12, 15, 19, 24, 27, 31, 35, 36, 39, 47]],
    // ]

    let path
    let name
    let cell_datas

    path = "images/base.PNG"
    name = "Base"
    cell_datas = [
      [0,  "center"],
      [1,  "center"],
      [2,  "center"],
      [3,  "center"],
      [4,  "center"],
      [5,  "center"],
      [6,  "center"],
      [7,  "center"],
      [8,  "center"],
      [9,  "center"],
      [10, "center"],
      [11, "center"],
      [12, "center"],
      [13, "center"],
      [14, "center"],
      [15, "center"],
      [16, "center"],
      [17, "center"],
      [18, "center"],
      [19, "center"],
      [20, "center"],
      [21, "center"],
      // [22, ["center"]],
      [23, "center"],
      [24, "center"],
      [25, "center"],
      [26, "center"],
      [27, "center"],
      [28, "center"],
      [29, "center"],
      [30, "center"],
      [31, "center"],
      [32, "center"],
      [33, "center"],
      [34, "center"],
      [35, "center"],
      [36, "center"],
      [37, "center"],
      [38, "center"],
      [39, "center"],
      [40, "center"],
      [41, "center"],
      [42, "center"],
      [43, "center"],
      [44, "center"],
      [45, "center"],
      [46, "center"],
      [47, "center"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)

    path = "images/bottom.PNG"
    name = "Bottom"
    cell_datas = [
      [24, "bottom"],
      [25, "bottom"],
      [26, "bottom"],
      [27, "bottom"],
      [36, "bottom"],
      [37, "bottom"],
      [38, "bottom"],
      [39, "bottom"],
      [41, "bottom"],
      [42, "bottom"],
      [44, "bottom"],
      [45, "bottom"],
      [47, "bottom"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)

    path = "images/top.PNG"
    name = "Top"
    cell_datas = [
      [0,  "top"],
      [1,  "top"],
      [2,  "top"],
      [3,  "top"],
      [5,  "top"],
      [6,  "top"],
      [8,  "top"],
      [10, "top"],
      [11, "top"],
      [36, "top"],
      [37, "top"],
      [38, "top"],
      [39, "top"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)

    path = "images/left.PNG"
    name = "Left"
    cell_datas = [
      [0,  "left"],
      [1,  "left"],
      [8,  "left"],
      [12, "left"],
      [13, "left"],
      [16, "left"],
      [20, "left"],
      [24, "left"],
      [25, "left"],
      [28, "left"],
      [36, "left"],
      [37, "left"],
      [44, "left"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)

    path = "images/right.PNG"
    name = "Right"
    cell_datas = [
      [0,  "right"],
      [3,  "right"],
      [11, "right"],
      [12, "right"],
      [15, "right"],
      [19, "right"],
      [24, "right"],
      [27, "right"],
      [31, "right"],
      [35, "right"],
      [36, "right"],
      [39, "right"],
      [47, "right"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)

    path = "images/outer_top_left.PNG"
    name = "Outer Top Left"
    cell_datas = [
      [0,  "outer_top_left"],
      [1,  "outer_top_left"],
      [8,  "outer_top_left"],
      [36, "outer_top_left"],
      [37, "outer_top_left"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)



    path = "images/outer_top_right.PNG"
    name = "Outer Top Right"
    cell_datas = [
      [0,  "outer_top_right"],
      [3,  "outer_top_right"],
      [11, "outer_top_right"],
      [36, "outer_top_right"],
      [39, "outer_top_right"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)

    path = "images/outer_bottom_left.PNG"
    name = "Outer Bottom Left"
    cell_datas = [
      [24, "outer_bottom_left"],
      [25, "outer_bottom_left"],
      [36, "outer_bottom_left"],
      [37, "outer_bottom_left"],
      [44, "outer_bottom_left"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)


    path = "images/outer_bottom_right.PNG"
    name = "Outer Bottom Right"
    cell_datas = [
      [24, "outer_bottom_right"],
      [27, "outer_bottom_right"],
      [36, "outer_bottom_right"],
      [39, "outer_bottom_right"],
      [47, "outer_bottom_right"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)
    


    path = "images/inner_bottom_right.PNG"
    name = "Inner Bottom Right"
    cell_datas = [
      [1,  "inner_bottom_right"],
      [2,  "inner_bottom_right"],
      [6,  "inner_bottom_right"],
      [13, "inner_bottom_right"],
      [14, "inner_bottom_right"],
      [21, "inner_bottom_right"],
      [23, "inner_bottom_right"],
      [28, "inner_bottom_right"],
      [30, "inner_bottom_right"],
      [46, "inner_bottom_right"],
      [40, "inner_bottom_right"],
      [4,  "inner_bottom_right"],
      [7,  "inner_bottom_right"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)


    path = "images/inner_bottom_left.PNG"
    name = "Inner Bottom Left"
    cell_datas = [
      [2,  "inner_bottom_left"],
      [3,  "inner_bottom_left"],
      [5,  "inner_bottom_left"],
      [14, "inner_bottom_left"],
      [15, "inner_bottom_left"],
      [29, "inner_bottom_left"],
      [31, "inner_bottom_left"],
      [32, "inner_bottom_left"],
      [34, "inner_bottom_left"],
      [46, "inner_bottom_left"],
      [43, "inner_bottom_left"],
      [4,  "inner_bottom_left"],
      [7,  "inner_bottom_left"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)

    path = "images/inner_top_right.PNG"
    name = "Inner Top Right"
    cell_datas = [
      [9,  "inner_top_right"],
      [13, "inner_top_right"],
      [14, "inner_top_right"],
      [16, "inner_top_right"],
      [18, "inner_top_right"],
      [23, "inner_top_right"],
      [25, "inner_top_right"],
      [26, "inner_top_right"],
      [34, "inner_top_right"],
      [40, "inner_top_right"],
      [43, "inner_top_right"],
      [4,  "inner_top_right"],
      [42, "inner_top_right"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)


    path = "images/inner_top_left.PNG"
    name = "Inner Top Left"
    cell_datas = [
      [9,  "inner_top_left"],
      [14, "inner_top_left"],
      [15, "inner_top_left"],
      [17, "inner_top_left"],
      [19, "inner_top_left"],
      [21, "inner_top_left"],
      [26, "inner_top_left"],
      [27, "inner_top_left"],
      [32, "inner_top_left"],
      [40, "inner_top_left"],
      [43, "inner_top_left"],
      [7,  "inner_top_left"],
      [41, "inner_top_left"],
    ]

    this.datas.tiles.add_tile(path, name, cell_datas)


    // this.datas.tiles.add_tile("images/bottom.PNG", "Bottom", [0, 1, 2, 3])
    // this.datas.tiles.add_tile("images/left.PNG", "Left", [0, 1, 2, 3])

    // this.add_category_item("buttons", "increase-resolution")
    // this.add_category_item("buttons", "decrease-resolution")
    // this.add_category_item("buttons", "add-tiles")
    // this.add_category_item("buttons", "clear-tiles")
    // this.add_category_item("buttons", "refresh-viewport")

    this.canvas = document.getElementById("viewport-canvas")
    this.ctx = this.canvas.getContext("2d");


    this.settings = {}
    this.settings.use_square = new SettingItem("use-square")
    this.settings.center_viewport = new SettingItem("center-viewport")
    this.settings.image_fit = new SettingItem("image-fit")
    this.settings.tiles_panel_show = new SettingItem("tiles-panel-show")
    this.settings.sliced_tiles_panel_show = new SettingItem("sliced-tiles-panel-show")

    this.settings.tile_column = new SettingItem("tile-column")
    this.settings.tile_row = new SettingItem("tile-row")
    this.settings.tile_width = new SettingItem("tile-width")
    this.settings.tile_height = new SettingItem("tile-height")

    this.cells = []
  
    this.settings.grid_show = new SettingItem("grid-show")
    this.settings.index_show = new SettingItem("index-show")
    this.settings.cell_show = new SettingItem("cell-show")
    this.settings.background_color = new SettingItem("background-color")
    this.settings.overlay_color = new SettingItem("overlay-color")

    

    this.settings.grid_thickness = new SettingItem("grid-thickness")


    // this.settings.tiles_panel_show = new SettingItem("tiles-panel-show")




    // this.add_category_item("settings", "grid-show")
    // this.add_category_item("settings", "grid-thickness")

    // this.add_category_item("settings", "background-color")

    // this.add_category_item("settings", "center-viewport")
    // this.add_category_item("settings", "image-fit")

    // this.add_category_item("settings", "tile-panel-show")



  }


  update_cells(){

    this.cells = []

    let columns = this.utility.tile_columns()
    let rows = this.utility.tile_rows()

    let width = this.utility.tile_width()
    let height = this.utility.tile_height()


    let total_width = this.utility.total_width()
    let total_height = this.utility.total_height()

    this.canvas.width = total_width
    this.canvas.height = total_height


    let cell_index = 0

    for (let cell_y=0; cell_y < rows; cell_y++){
      for (let cell_x = 0; cell_x < columns; cell_x++){



        let pos_x = width * cell_x
        let pos_y = height * cell_y

        let cell = new Cell(cell_index, cell_x, cell_y, width, height, pos_x, pos_y)
        this.cells.push(cell)

        cell_index += 1
      }
    }



  }

  draw_tiles(){

    let columns = this.utility.tile_columns()
    let rows = this.utility.tile_rows()

    let width = this.utility.tile_width()
    let height = this.utility.tile_height()


    let total_width = this.utility.total_width()
    let total_height = this.utility.total_height()

    this.canvas.width = total_width
    this.canvas.height = total_height

    let ctx = this.ctx



    let cell_index = 0

    for (let cell_y=0; cell_y < rows; cell_y++){
      for (let cell_x = 0; cell_x < columns; cell_x++){

        let pos_x = width * cell_x
        let pos_y = height * cell_y


        for (let tile_index in this.datas.tiles.tiles){

          let tile = this.datas.tiles.tiles[tile_index]

          for (let c in tile.cell_datas){


            let cell_data = tile.cell_datas[c]

            if (cell_data[0] == cell_index){

              if (cell_data[1] == "top"){

                if ([0, 36].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+width/4, pos_y, width/2, height/2)
                   ctx.clip()
                }


                if ([3, 11, 39].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y, width/2, height/2)
                   ctx.clip()
                }

                if ([1, 37, 8].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+width/2, pos_y, width, height/2)
                   ctx.clip()
                }

                if ([2, 5, 6, 10, 38].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y, width, height/2)
                   ctx.clip()
                }


              }

              if (cell_data[1] == "outer_top_left"){

                if ([0, 1, 8, 36, 37].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y, width/2, height/2)
                   ctx.clip()
                }

              }

              if (cell_data[1] == "outer_top_right"){

                if ([0, 3, 11, 36, 39].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+width/2, pos_y, width/2, height/2)
                   ctx.clip()
                }

              }

              if (cell_data[1] == "outer_bottom_left"){

                if ([24, 25, 36, 37, 44].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y+height/2, width/2, height/2)
                   ctx.clip()
                }

              }

              if (cell_data[1] == "outer_bottom_right"){

                if ([27, 39, 47, 24, 36].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+width/2, pos_y+height/2, width, height/2)
                   ctx.clip()
                }

              }


              if (cell_data[1] == "inner_bottom_right"){

                if ([1, 2, 4, 6, 7, 13, 14, 21, 23, 28, 30, 40, 46].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+width/2, pos_y+height/2, width/2, height/2)
                   ctx.clip()
                }

              }

              if (cell_data[1] == "inner_bottom_left"){

                if ([2, 3, 4, 5, 7, 14, 15, 29, 31, 32, 34, 43, 46].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y+height/2, width/2, height/2)
                   ctx.clip()
                }

              }

              if (cell_data[1] == "inner_top_right"){

                if ([4, 9, 13, 14, 16, 18, 23, 25, 26, 34, 40, 42, 43].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+width/2, pos_y, width/2, height/2)
                   ctx.clip()
                }

              }

              if (cell_data[1] == "inner_top_left"){

                if ([7, 9, 14, 15, 17, 19, 21, 26, 27, 32, 40, 41, 43].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y, width/2, height/2)
                   ctx.clip()
                }

              }



              if (cell_data[1] == "bottom"){

                if ([27, 47, 39].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y+height/2, width/2, height/2)
                   ctx.clip()
                }

                if ([26, 38, 41, 42, 45].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y+height/2, width, height/2)
                   ctx.clip()
                }


                if ([25, 37, 44].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+width/2, pos_y+height/2, width/2, height/2)
                   ctx.clip()
                }

                if ([24, 36].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+width/2, pos_y/2, width/2, height)
                   ctx.clip()
                }

              }



               
              if (cell_data[1] == "left"){

                // if ([8, 25, 24, 27, 36, 37, 44].includes(cell_index)){

                //    ctx.save();
                //    ctx.beginPath()
                //    ctx.clip()
                // }

                // if ([0, 1].includes(cell_index)){

                //    ctx.save();
                //    ctx.beginPath()
                //    ctx.rect(pos_x, pos_y+height/2, width/2, height)
                //    ctx.clip()
                // }
                //
                if ([12, 13, 16, 20, 28].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y, width/2, height)
                   ctx.clip()
                }
                //

                if ([0, 1, 8].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y+height/2, width/2, height/4*3)
                   ctx.clip()
                }


                if ([24, 25, 44].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y, width/2, height/4*3)
                   ctx.clip()
                }

                if ([36, 37].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x, pos_y+height/4, width/2, height/2)
                   ctx.clip()
                }


                // if ([25, 27, 36, 37, 44].includes(cell_index)){
                //    ctx.save();
                //    ctx.beginPath()
                //    ctx.rect(pos_x, pos_y, width, height)
                //    ctx.clip()
                // }
              }
               
              if (cell_data[1] == "right"){

                if ([12].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+ width/2, pos_y, width, height)
                   ctx.clip()
                }


                if ([0, 3, 7, 11].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+ width/2, pos_y + height/2 , width, height)
                   ctx.clip()
                }

                if ([36, 39].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+width/2, pos_y+height/4, width/2, height/2)
                   ctx.clip()
                }
                if ([24, 27, 47].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+width/2, pos_y, width, height/2)
                   ctx.clip()
                }

                if ([15, 19, 31, 35].includes(cell_index)){

                   ctx.save();
                   ctx.beginPath()
                   ctx.rect(pos_x+width/2, pos_y, width, height)
                   ctx.clip()
                }


              }





              if (cell_data[1] == "center"){
                if ([0].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width/4, pos_y + height/4, width/2, height)
                ctx.clip(region)
                }

                if ([12].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width/4, pos_y, width/2, height)
                ctx.clip(region)
                }

                if ([24].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width/4, pos_y, width/2, height - height/4)
                ctx.clip(region)
                }

                if ([36].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width/4, pos_y + height/4, width/2, height - height/2)
                ctx.clip(region)
                }

                if ([1].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width/4, pos_y + height/4, width, height)
                region.rect(pos_x + width/4*3, pos_y + height/4*3, width, height)
                ctx.clip(region, "evenodd")
                }

                if ([2].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y + height/4, width, height/2)
                region.rect(pos_x + width / 4, pos_y + height/4, width / 2, height)
                ctx.clip(region)
                }
                if ([3].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y + height/4, width/2, height/2)
                region.rect(pos_x + width / 4, pos_y + height/4, width / 2, height)
                ctx.clip(region)
                }
                if ([13].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width /4, pos_y, width/2, height)
                region.rect(pos_x + width / 4, pos_y + height/4, width, height/2)
                ctx.clip(region)
                }
                if ([14].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width /4, pos_y, width/2, height)
                region.rect(pos_x , pos_y + height/4, width, height/2)
                ctx.clip(region)
                }

                if ([15].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width /4, pos_y, width/2, height)
                region.rect(pos_x , pos_y + height/4, width/2, height/2)
                ctx.clip(region)
                }

                if ([4].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y, width/4*3, height/2)
                region.rect(pos_x, pos_y + height/4, width, height/2)
                region.rect(pos_x + width/4, pos_y + height/4*3, width/2, height/2)
                ctx.clip(region)
                }

                if ([16].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width /4, pos_y, width/2, height)
                region.rect(pos_x + width / 4 , pos_y + height/4, width, height)
                ctx.clip(region)
                }

                if ([28].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width /4, pos_y, width/2, height)
                region.rect(pos_x + width / 4 , pos_y, width, height/4*3)
                ctx.clip(region)
                }
                if ([40].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width /4, pos_y, width/2, height)
                region.rect(pos_x, pos_y + height / 4, width, height/2)
                region.rect(pos_x, pos_y+ height/4, width/2, height)
                ctx.clip(region)
                }

                if ([25].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width /4, pos_y, width/2, height/4*3)
                region.rect(pos_x + width / 4 , pos_y + height/4, width, height/2)
                ctx.clip(region)
                }
                if ([26].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width /4, pos_y, width/2, height/4*3)
                region.rect(pos_x , pos_y + height/4, width, height/2)
                ctx.clip(region)
                }

                if ([27].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width /4, pos_y, width/2, height/4*3)
                region.rect(pos_x , pos_y + height/4, width/2, height/2)
                ctx.clip(region)
                }

                if ([37].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x + width / 4 , pos_y + height/4, width, height/2)
                ctx.clip(region)
                }

                if ([38].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y + height/4, width, height/2)
                ctx.clip(region)
                }

                if ([39].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y + height/4, width/4*3, height/2)
                ctx.clip(region)
                }

                if ([5].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y + height/4, width, height/2)
                region.rect(pos_x + width/4 , pos_y + height/4, width, height)
                ctx.clip(region)
                }

                if ([17].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y + height/4, width, height)
                region.rect(pos_x + width/4 , pos_y, width, height)
                ctx.clip(region)
                }


                if ([29].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y, width, height/4*3)
                region.rect(pos_x + width/4 , pos_y, width, height)
                ctx.clip(region)
                }

                if ([41].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y+height/4, width, height/2)
                region.rect(pos_x + width/4 , pos_y, width, height/4*3)
                ctx.clip(region)
                }

                if ([6].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y+height/4, width/4*3, height)
                region.rect(pos_x + width/4 , pos_y + height/4, width, height/2)
                ctx.clip(region)
                }

                if ([7].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y+height/4, width, height/2)
                region.rect(pos_x + width/4 , pos_y, width/2, height)
                region.rect(pos_x+width/4 , pos_y, width, height/2)
                ctx.clip(region)
                }

                if ([18].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y+height/4, width, height)
                region.rect(pos_x , pos_y, width/4*3, height)
                ctx.clip(region)
                }

                if ([19].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y+height/4, width/2, height)
                region.rect(pos_x+width/4 , pos_y, width/2, height)
                ctx.clip(region)
                }


                if ([30].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y, width, height/4*3)
                region.rect(pos_x, pos_y, width/4*3, height)
                ctx.clip(region)
                }


                if ([42].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x , pos_y+height/4, width, height/2)
                region.rect(pos_x, pos_y, width/4*3, height/2)
                ctx.clip(region)
                }

                if ([43].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y+height/4, width, height/2)
                region.rect(pos_x+width/4, pos_y, width/2, height/2)
                region.rect(pos_x+width/4, pos_y+height/2, width, height)
                ctx.clip(region)
                }

                if ([31].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y, width/4*3, height/4*3)
                region.rect(pos_x+width/4, pos_y+height/4, width/2, height/4*3)
                ctx.clip(region)
                }

                if ([8].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x+width/4, pos_y+height/4, width, height/4*3)
                ctx.clip(region)
                }

                if ([9].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y+height/4, width, height/4*3)
                region.rect(pos_x+width/4, pos_y, width/2, height/4*3)
                ctx.clip(region)
                }

                if ([10].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y+height/4, width, height)
                ctx.clip(region)
                }

                if ([11].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y+height/4, width/4*3, height)
                ctx.clip(region)
                }

                if ([20].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x+width/4, pos_y, width/4*3, height)
                ctx.clip(region)
                }

                if ([32].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x+width/4, pos_y, width/4*3, height)
                region.rect(pos_x, pos_y+height/4, width/4*3, height/2)
                ctx.clip(region)
                }

                if ([44].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x+width/4, pos_y, width/4*3, height/4*3)
                ctx.clip(region)
                }

                if ([21].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x+width/4, pos_y, width/4*3, height/4*3)
                region.rect(pos_x, pos_y+height/4, width/4*3, height/4*3)
                ctx.clip(region)
                }

                if ([34].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y, width/4*3, height/4*3)
                region.rect(pos_x+width/4, pos_y+height/4, width/4*3, height/4*3)
                ctx.clip(region)
                }

                if ([45].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y, width, height/4*3)
                ctx.clip(region)
                }

                if ([23].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y, width/4*3, height)
                region.rect(pos_x, pos_y+height/4, width, height/2)
                ctx.clip(region)
                }
                if ([35].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y, width/4*3, height)
                ctx.clip(region)
                }
                if ([46].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y, width, height/4*3)
                region.rect(pos_x+width/4, pos_y, width/2, height)
                ctx.clip(region)
                }
                if ([47].includes(cell_index)){
                ctx.save();
                ctx.beginPath()
                let region = new Path2D()
                region.rect(pos_x, pos_y, width/4*3, height/4*3)
                ctx.clip(region)
                }




              }
              //
              ctx.drawImage(tile.image, pos_x, pos_y, width, height)
              ctx.restore()




            }


          }


        }


        this.draw_coordinate(ctx, pos_x, pos_y, width, height, cell_x, cell_y)
        this.draw_index(ctx, pos_x, pos_y, width, height, cell_index)
        this.draw_grid(ctx, pos_x, pos_y, width, height)
        cell_index += 1



    // for (let c=0; c < this.cells.length; c++){

    //   let cell = this.cells[c]

    //   cell.draw(this.ctx, true, true, true)

    // }


  }


  }


}

  draw_coordinate(ctx, pos_x, pos_y, width, height, cell_x, cell_y){

    if (app.settings.cell_show.item.checked){
    let font_size = width / 10
    ctx.font = "" + font_size + "px Arial";
    ctx.textAlign="center"
    ctx.textBaseline="middle"
    ctx.fillStyle = app.settings.overlay_color.item.value;
    let coordinate_text = "( " + cell_x+  ", " + cell_y +  " )"
    // ctx.fillText(coordinate_text, pos_x + width / 2 , pos_y + height / 2); 
    ctx.fillText(coordinate_text, pos_x + width / 2 , pos_y + height / 2); 
    // ctx.fillText(coordinate_text, pos_x + width / 10, pos_y + height / 10); 
    }
  }

  draw_index(ctx, pos_x, pos_y, width, height, index){

    if (app.settings.index_show.item.checked){
    let font_size = width / 10
    ctx.font = "" + font_size + "px Arial";
    ctx.textAlign="center"
    ctx.textBaseline="middle"
    ctx.fillStyle = app.settings.overlay_color.item.value;
    let coordinate_text = index
    ctx.fillText(coordinate_text, pos_x + width / 10, pos_y + height / 10); 
    }



}

  draw_grid(ctx, pos_x, pos_y, width, height){

    if (app.settings.grid_show.item.checked){

    // ctx.line_width = app.settings.grid_thickness.item.value;
    ctx.lineWidth = app.settings.grid_thickness.item.value;
    // ctx.strokeStyle = "black";
    ctx.strokeStyle = app.settings.overlay_color.item.value;
    ctx.strokeRect(pos_x, pos_y, width, height);

    }

}



}

app = new App()
app.update_cells()
app.draw_tiles()
app.settings.grid_show.item.oninput=()=>{
  app.draw_tiles()
  app.settings.grid_thickness.set_visibility(app.settings.grid_show.item.checked)
  
}
app.settings.index_show.item.oninput=()=>{app.draw_tiles()}
app.settings.cell_show.item.oninput=()=>{app.draw_tiles()}
app.settings.grid_thickness.item.oninput=()=>{app.draw_tiles()}

function set_center_viewport(){

  if (app.settings.center_viewport.item.checked){
  app.panels.viewport.item.classList.add("center")
  }
  else{
    app.panels.viewport.item.classList.remove("center")
  }

}

function fit_image_viewport(){


  if (app.settings.image_fit.item.checked){
    app.canvas.classList.add("fit-container")
  }
  else{
    app.canvas.classList.remove("fit-container")
  }

}

app.settings.center_viewport.item.oninput=()=>{
  set_center_viewport()
}

app.settings.image_fit.item.oninput=()=>{
  fit_image_viewport()
}


app.settings.background_color.item.oninput=()=>{

app.canvas.style.backgroundColor = app.settings.background_color.item.value

}

app.settings.grid_thickness.set_visibility(app.settings.grid_show.item.checked)

app.canvas.style.backgroundColor = app.settings.background_color.item.value

app.settings.tiles_panel_show.item.oninput=()=>{

  app.panels.tiles.set_visibility(app.settings.tiles_panel_show.item.checked)

}
app.panels.tiles.set_visibility(app.settings.tiles_panel_show.item.checked)
set_center_viewport()
fit_image_viewport()



  app.panels.tiles.set_visibility(app.settings.tiles_panel_show.item.checked)


function set_use_square(){

  if (app.settings.use_square.item.checked){
    app.settings.tile_width.set_label("Size")
    app.settings.tile_height.item.value = app.settings.tile_width.item.value
    app.settings.tile_height.set_visibility(false)
  

  }else{
    app.settings.tile_width.set_label("Width")
    app.settings.tile_height.set_visibility(true)

  }

}




app.settings.tile_width.item.oninput=()=>{

  app.settings.tile_height.item.value = app.settings.tile_width.item.value

  app.draw_tiles()}
  app.settings.tile_height.item.oninput=()=>{app.draw_tiles()}
  app.settings.overlay_color.item.oninput=()=>{app.draw_tiles()}
  app.settings.use_square.item.oninput=()=>{
  set_use_square()
  app.draw_tiles()
}
set_use_square()



app.buttons.increase_resolution.item.onclick = () => {
  app.settings.tile_width.item.value *= 2
  app.settings.tile_height.item.value *= 2
  app.draw_tiles()
}
app.buttons.decrease_resolution.item.onclick = () => {
  app.settings.tile_width.item.value /= 2
  app.settings.tile_height.item.value /= 2
  app.draw_tiles()
}
app.buttons.refresh.item.onclick= ()=> {app.draw_tiles()}


app.settings.sliced_tiles_panel_show.item.oninput = () => {

  app.panels.sliced_tiles.set_visibility(app.settings.sliced_tiles_panel_show.item.checked)

}

  app.panels.sliced_tiles.set_visibility(app.settings.sliced_tiles_panel_show.item.checked)


