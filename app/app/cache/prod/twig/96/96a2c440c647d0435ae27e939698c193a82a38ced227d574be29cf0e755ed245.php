<?php

/* FOSOAuthServerBundle::layout.html.twig */
class __TwigTemplate_5b03a52fb19ff5b54d06897faf20cebc889d9c767560a711cb6de0a7d5297993 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
            'fos_oauth_server_content' => array($this, 'block_fos_oauth_server_content'),
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<!DOCTYPE html>
<html>
    <head>
        <meta charset=\"UTF-8\" />
    </head>
    <body>
        <div>
            ";
        // line 8
        $this->displayBlock('fos_oauth_server_content', $context, $blocks);
        // line 10
        echo "        </div>
    </body>
</html>
";
    }

    // line 8
    public function block_fos_oauth_server_content($context, array $blocks = array())
    {
        // line 9
        echo "            ";
    }

    public function getTemplateName()
    {
        return "FOSOAuthServerBundle::layout.html.twig";
    }

    public function getDebugInfo()
    {
        return array (  41 => 9,  38 => 8,  31 => 10,  29 => 8,  20 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "FOSOAuthServerBundle::layout.html.twig", "/home/tsmai587/public_html/projetos/igreja/app/vendor/friendsofsymfony/oauth-server-bundle/Resources/views/layout.html.twig");
    }
}
