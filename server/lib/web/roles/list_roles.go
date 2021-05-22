package roles

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/lavalleeale/sshca/server/lib"

	"github.com/lavalleeale/sshca/server/db"
)

func List(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("token")
	if err != nil {
		http.Error(w, "Failed To Get Cookie", http.StatusUnauthorized)
		log.Print("Error: Failed to get cookie")
		return
	}
	token, err := lib.Verify_jwt(cookie.Value)
	if err != nil {
		http.Error(w, "No Token", http.StatusUnauthorized)
		log.Print(err)
		return
	}
	var user db.User
	db.Db.First(&user, "email = ?", token)
	if user.ID == 0 {
		http.Error(w, "User Does Not Exist", http.StatusUnauthorized)
		log.Print("Error: User Does Not Exist")
		return
	}
	var roles []db.Role
	db.Db.Find(&roles)
	marshal, err := json.Marshal(roles)
	if err != nil {
		http.Error(w, "Failed to generate response", http.StatusInternalServerError)
		log.Print("Error: Failed to Marshal JSON")
		return
	}
	fmt.Fprint(w, string(marshal))
}