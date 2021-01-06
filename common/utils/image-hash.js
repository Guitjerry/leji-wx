let imageHash = {
  'more': '/2/28/9e4d2ced7725d19008aab7333444bjpeg.jpeg',
  'shop_safe_normal': '/e/43/a4befa1ceadda6e5b269794edbda2jpeg.jpeg',
  'shop_safe_good': '/6/d8/865159f628131cd68badf5fbc64abjpeg.jpeg',
  'shop_safe_bad': '/c/f7/b5f8591c23f0f2ff7b677712a9f1djpeg.jpeg',
  'selected': '/f/96/e91d26d139a1e476b8ac533ddc0acjpeg.jpeg',
  'search': '/7/1b/42568ebd10ab060b5d29f3e9ec323jpeg.jpeg',
  'rating': '/f/f8/6ed8b6971d8b708cdba7b483ec96ejpeg.jpeg',
  'not_selected': '/c/f3/6ea22dcea3757355b178066ddd716jpeg.jpeg',
  'location': '/3/45/96c598dfbe16c03556172b1affc12jpeg.jpeg',
  'edit': '/4/ff/c62ab5dbfbf31249a6d7c9ed3bed9jpeg.jpeg',
  'cart': '/f/90/b7d8c8aafa1a19c4ec1e08f7edc68jpeg.jpeg',
  'add': '/4/c9/9015098b7e572eb5d8d99b5e7c59ajpeg.jpeg',
}

let keys = Object.keys(imageHash)
let length = keys.length
// DO NOT REMOVE 'http:'
// if you do, images won't be loaded on mobile devices
while (length --) {
  imageHash[keys[length]] = 'http://fuss10.elemecdn.com' + imageHash[keys[length]]
}

module.exports = imageHash
