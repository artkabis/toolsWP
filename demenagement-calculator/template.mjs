export const template=()=>{
return
  (`
  <div class="rowCalc flex-row row-top">
  <div class="col-4 flex-col">
    <div class="col-menu s-col-menu-sticky">
      <ul>
      <li id="field_37_31" class="gfield totalvolume field_sublabel_above field_description_below gfield_visibility_visible"><label class="gfield_label" for="input_37_31">Volume à déménager</label><div class="ginput_container ginput_container_text"><div class="ginput_container ginput_container_text" id="grandTotal">0.00</div></div></li>
      <li id="field_37_321" class="gfield result-volume-a-calculer field_sublabel_above field_description_below gfield_visibility_visible"><label class="gfield_label" for="input_37_321">Liste des éléments à déménager</label><div class="ginput_container ginput_container_textarea"><textarea name="input_321" id="input_37_321" class="textarea medium" tabindex="50" aria-invalid="false" rows="10" cols="50"></textarea></div></li>
      
      </ul>
    </div>
  </div>
  <div class="col-8 flex-col">
    <div class="monCalculateur" id="calculateur">
      <div id="Tabs">
        <ul class="resp-tabs-list">
        </ul>
        <div class="resp-tabs-container">
          
        </div>
        <a class="button-cut-corner slide-out-btn">Fermer le calculateur</a>
        <a class="button-cut-corner reset-calculateur">Remettre à zéro</a>
      </div>
    </div>
  </div>
</div>
<div class="row-bottom"></div>
<li id="field_49_43" class="gfield volume-a-calculer field_sublabel_below field_description_below gfield_visibility_visible"><label class="gfield_label" for="input_49_43">Liste fournitures formatage</label><div class="ginput_container ginput_container_textarea"></div></li>
`);
}
