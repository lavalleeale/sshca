package cmd

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/lavalleeale/sshca/client/lib"
	homedir "github.com/mitchellh/go-homedir"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func init() {
	rootCmd.AddCommand(versionCmd)
}

var versionCmd = &cobra.Command{
	Use:   "login",
	Short: "Start Login Sequence",
	Long:  `LONG DESC`,
	Run: func(cmd *cobra.Command, args []string) {
		if viper.GetString("keyLocation") == "" {
			reader := bufio.NewReader(os.Stdin)
			fmt.Print("Enter SSH public key location: ")
			text, _ := reader.ReadString('\n')
			dir, _ := homedir.Dir()
			if text == "~" {
				text = dir
			} else if strings.HasPrefix(text, "~/") {
				text = filepath.Join(dir, text[2:])
			}
			viper.Set("keyLocation", text)
			viper.WriteConfig()
		}
		keyLocation := viper.GetString("keyLocation")
		keyLocation = keyLocation[:len(keyLocation)-1]
		data, err := ioutil.ReadFile(keyLocation)
		if err != nil {
			log.Fatal("Error reading public key file")
		}
		var dat = map[string]string{}
		dat["code"] = lib.Login()
		dat["key"] = string(data)
		marshal, err := json.Marshal(dat)
		if err != nil {
			log.Fatal("Error encoding JSON")
		}
		resp, err := http.Post("http://localhost:5000/cli/login", "application/json", bytes.NewBuffer(marshal))
		if err != nil {
			log.Fatal("Http Request Failed")
		}
		defer resp.Body.Close()
		if resp.StatusCode == http.StatusOK {
			bodyBytes, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				log.Fatal(err)
			}
			bodyString := string(bodyBytes)
			fmt.Println(bodyString)
		}
	},
}
