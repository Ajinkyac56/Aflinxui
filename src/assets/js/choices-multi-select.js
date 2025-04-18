//-------------------Multiple select-----------------//
$(document).ready(function() {
//     var insurerProductCategorySeries = new Choices('#insurer-product-category-series', {
//         removeItemButton: true,
//         maxItemCount: 20,
//         searchResultLimit: 20,
//         renderChoiceLimit: 20,
//   });
});
$(document).ready(function() {
    var insurerProductCategoryPolicy = new Choices('#insurer-product-category-policy1', {
        removeItemButton: true,
        maxItemCount: 20,
        searchResultLimit: 20,
        renderChoiceLimit: 20,
    });
});
$(document).ready(function() {
    var insurerProductCategoryPolicyView = new Choices('#insurer-product-category-policy-view1', {
        removeItemButton: true,
        maxItemCount: 20,
        searchResultLimit: 20,
        renderChoiceLimit: 20,
    });
    insurerProductCategoryPolicyView.disable();
});
$(document).ready(function() {
    var partnerNatureBusiness = new Choices('#partner-nature-business', {
        removeItemButton: true,
        maxItemCount: 20,
        searchResultLimit: 20,
        renderChoiceLimit: 20,
    });
});

//-------------------Multiple select------------------//
$(document).ready(function() {
    var partnerAffiliations = new Choices('#partner-affiliations', {
        removeItemButton: true,
        maxItemCount: 20,
        searchResultLimit: 20,
        renderChoiceLimit: 20,
    });
});