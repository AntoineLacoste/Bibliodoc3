var array = function() {
    function ExtractValues(aTab, cle) {

        /// <summary>
        /// Extrait une colonne d'un tableau incrémenté associatif (retour idb.Read())
        /// </summary>
        /// <param name="aTab">tableau incrémenté associatif</param>
        /// <param name="cle">Clef à extraire</param>
        /// <returns type="">tableau incrémenté contenant les valeurs de clef</returns>

        var aRetour = [];
        for (var i in aTab) {
            aRetour.push(aTab[i][cle]);
        }
        return aRetour;
    }
}
module.exports=array;