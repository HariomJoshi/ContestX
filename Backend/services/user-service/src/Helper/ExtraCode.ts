export const getCompleteCode = (currCode: string, language: string): String => {
  if (language === "java") {
    return `
    import java.util.*;
    public class Solution {
      public static void main(String[] args) {
          try {
              int t;
              Scanner scan = new Scanner(System.in);
              t = scan.nextInt();
              while(t-- != 0){
                  solve();
              }
          } catch (Exception e) {
              e.printStackTrace();
              throw new NullPointerException("kya kr raha bhai ?");
          }
      }
      ${currCode}

    }`;
  } else {
    return "";
  }
};
