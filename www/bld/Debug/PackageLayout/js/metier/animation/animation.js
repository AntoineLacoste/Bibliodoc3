//*********** PARTIE ANIMATION CLICK *****************/
function addPointerDownHandlers(selector) {
    /// <summary>
    /// Ajoute une animation "enfoncé" sur un bouton 
    /// </summary>
    /// <param name="selector">Selecteur pour la fonction WinJS.Utilities.query</param>
    var elts = WinJS.Utilities.query(selector);
    elts.listen('pointerdown', function (evt) { WinJS.UI.Animation.pointerDown(evt.target); evt.preventDefault(); });
    elts.listen('touchstart', function (evt) { WinJS.UI.Animation.pointerDown(evt.target); evt.preventDefault(); });
    elts.listen('mousedown', function (evt) { WinJS.UI.Animation.pointerDown(evt.target); evt.preventDefault(); });
}

function addPointerUpHandlers(selector) {
    /// <summary>
    /// Ajoute une animation "relaché" sur un bouton
    /// </summary>
    /// <param name="selector">Selecteur pour la fonction WinJS.Utilities.query</param>
    var elts = WinJS.Utilities.query(selector);
    elts.listen('pointerup', function (evt) { WinJS.UI.Animation.pointerUp(evt.target); evt.preventDefault(); });
    elts.listen('touchend', function (evt) { WinJS.UI.Animation.pointerUp(evt.target); evt.preventDefault(); });
    elts.listen('mouseup', function (evt) { WinJS.UI.Animation.pointerUp(evt.target); evt.preventDefault(); });
}

function animateClick(selector) {
	/// <summary>
	/// Ajoute une animation click complète: "enfoncé + relaché"
	/// </summary>
    /// <param name="selector">Selecteur pour la fonction WinJS.Utilities.query</param>
    addPointerDownHandlers(selector);
    addPointerUpHandlers(selector);
}
//***************** FIN PARTIE ANIMATION CLICK ******************/